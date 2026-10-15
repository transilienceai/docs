import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain','.sh':'text/plain','.yaml':'text/plain'};
http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/__responsive-preview/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync('test/responsive-preview.html'));return;}
 const requested=path.resolve(base,'.'+pathname);
 if(!requested.startsWith(base+path.sep)&&requested!==base){res.writeHead(403);res.end();return;}
 let file=requested;
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 let status=200;if(!fs.existsSync(file)){file=path.join(base,'404.html');status=404;}
 res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).pipe(res);
}).listen(4790,'127.0.0.1',()=>console.log('Onboarding preview: http://127.0.0.1:4790'));
