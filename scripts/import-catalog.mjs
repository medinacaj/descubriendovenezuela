// Imports only new, sourced documentary records from the public catalog.
// Managed records must be edited in content/places.json and imported again on a fresh database.
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { catalogSchema } from "../content/schema.mjs";
try { process.loadEnvFile(".env"); } catch (e) { if(e.code !== "ENOENT") throw e; }
if(!process.env.DATABASE_URL) throw Error("DATABASE_URL no configurada");
const places=catalogSchema.parse(JSON.parse(await readFile("content/places.json","utf8")));
const pool=new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000});
const client=await pool.connect();
let inserted=0,skipped=0;
async function territory(name,kind,parent,source){
 const existing=await client.query("SELECT id FROM territories WHERE name=$1 AND kind=$2 AND parent_id IS NOT DISTINCT FROM $3::integer ORDER BY id LIMIT 1",[name,kind,parent]);
 if(existing.rows.length) return existing.rows[0].id;
 return (await client.query("INSERT INTO territories(name,kind,parent_id,source) VALUES($1,$2,$3,$4) RETURNING id",[name,kind,parent,source])).rows[0].id;
}
try{
 await client.query("BEGIN");
 await client.query("SELECT pg_advisory_xact_lock(4411062026)");
 const country=await territory("Venezuela","country",null,"https://www.iso.org/obp/ui/#iso:code:3166:VE");
 for(const p of places){
  const region=p.region?await territory(p.region,"region",country,p.sourceUrls[0]):null;
  const record=await client.query(
   "INSERT INTO places(name,category,territory_id,description,source,reviewed_at,status,published,sensitive,location,demo,catalog_id,verification_note) VALUES($1,$2,$3,$4,$5,$6,'verified',true,false,NULL,false,$7,$8) ON CONFLICT(catalog_id) DO NOTHING RETURNING *",
   [p.name,p.category,region||country,p.description,p.sourceUrls[0],p.reviewedAt,p.id,p.verification]);
  if(record.rowCount){
   inserted++;
   await client.query("INSERT INTO change_log(place_id,actor,action,before_data,after_data) VALUES($1,NULL,'catalog_import',NULL,$2)",[record.rows[0].id,record.rows[0]]);
  }else skipped++;
 }
 await client.query("COMMIT");
 console.log("Importación documental: "+inserted+" nuevos; "+skipped+" previamente existentes. No se sobrescribieron fichas.");
}catch(error){await client.query("ROLLBACK");throw error;}finally{client.release();await pool.end();}
