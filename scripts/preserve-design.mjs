import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const id = process.argv[2]
if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
  throw new Error('Uso: node scripts/preserve-design.mjs slug-do-design')
}
const destination = `public/arquivo/${id}.tar.gz`
if (existsSync(destination)) throw new Error(`O design ${id} já existe. Arquivos históricos não devem ser sobrescritos.`)
mkdirSync('public/arquivo', { recursive: true })
// Include working-tree source, including new design files. Media stays at its original URL.
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'])
  .toString().split('\0').filter(Boolean).filter(path => existsSync(path) && !path.startsWith('public/') && !path.startsWith('.idea/') && !/(^|\/)\.env(?:\.|$)/.test(path))
execFileSync('tar', ['-czf', destination, '--null', '-T', '-'], { input: Buffer.from([...new Set(files)].join('\0') + '\0') })
writeFileSync(`public/arquivo/${id}.json`, JSON.stringify({
  id, capturedAt: new Date().toISOString(),
  baseCommit: execFileSync('git', ['rev-parse', 'HEAD']).toString().trim(),
  sha256: createHash('sha256').update(readFileSync(destination)).digest('hex'),
  media: 'Images and other public media are not duplicated; their existing public URLs are retained.'
}, null, 2) + '\n')
console.log(`Design preservado: ${destination}`)
