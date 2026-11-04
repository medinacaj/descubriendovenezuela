import {it,expect} from 'vitest';
import places from '../content/places.json';
import {readFile} from 'node:fs/promises';
it('catálogo real diferencia revisión documental de consulta primaria',()=>{
 expect(new Set(places.map(p=>p.id)).size).toBe(3);
 for(const p of places){expect(p.demo).toBe(false);expect(p.sourceUrls).toHaveLength(2);expect(p.primaryConsulted).toBe(false);expect(p.lat).toBeNull();expect(p.lon).toBeNull();expect(p.photos).toEqual([]);expect(p.price).toBeNull();}
});
it('Pages incorpora destinos y fuentes, sin ejemplos sintéticos',async()=>{
 const html=await readFile('docs/index.html','utf8');
 for(const p of places){expect(html).toContain(p.name);expect(html).toContain(p.sourceUrls[0]);}
 expect(html).not.toContain('Paisaje por descubrir · DEMO');
 expect(html).toContain('consulta directa a UNESCO');
});
