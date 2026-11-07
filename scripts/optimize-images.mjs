/** Copias WebP responsivas: únicamente de originales locales licenciados y documentados. */
import {readFile,stat,writeFile} from "node:fs/promises";
import sharp from "sharp";
const manifest=JSON.parse(await readFile("content/licensed-photographs.json","utf8"));
const seen=new Set();let newCount=0,existingCount=0;
for(const media of manifest){
 if(seen.has(media.output))throw Error("Duplicado "+media.output);
 seen.add(media.output);
 const input="docs/media/"+media.output;
 if((await stat(input)).size<5000)throw Error("No existe original "+input);
 for(const width of [480,800]){
  const dest=input.replace(/\.webp$/,"-"+width+".webp");
  const previous=await stat(dest).catch(()=>null);
  if(previous?.size>3000){existingCount++;continue;}
  const bytes=await sharp(input,{limitInputPixels:50000000}).rotate().resize({width,withoutEnlargement:true}).webp({quality:75,effort:4}).toBuffer();
  if(bytes.length<3000)throw Error("Derivado sin contenido "+dest);
  await writeFile(dest,bytes);
  newCount++;
 }
}
console.log("Originales "+seen.size+"; variantes nuevas "+newCount+"; conservadas "+existingCount);
