import { lstat, mkdir, realpath, symlink } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../packages/audit-log')
const packageRealPath = await realpath(packageRoot)
const hosts = process.argv.slice(2)

if (!hosts.length) {
  console.error('Usage: node scripts/link-audit-log.mjs <crm-host-path> [<crm-host-path> ...]')
  process.exit(1)
}

for (const host of hosts) {
  const linkPath = resolve(host, 'node_modules/@lepsios/crm-audit-log')

  try {
    const stat = await lstat(linkPath)
    if (!stat.isSymbolicLink() || await realpath(linkPath) !== packageRealPath) {
      throw new Error(`Refusing to replace existing path: ${linkPath}`)
    }
    console.log(`Already linked: ${linkPath}`)
  }
  catch (error) {
    if (error.code !== 'ENOENT')
      throw error

    await mkdir(dirname(linkPath), { recursive: true })
    await symlink(packageRealPath, linkPath, 'dir')
    console.log(`Linked ${linkPath} -> ${packageRealPath}`)
  }
}
