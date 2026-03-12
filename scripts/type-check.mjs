import { mkdir, writeFile } from "node:fs/promises"
import { spawn } from "node:child_process"

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    })

    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? 1}`))
    })
  })
}

await run("npx", ["next", "typegen"])
await mkdir(".next/types", { recursive: true })
await writeFile(".next/types/cache-life.d.ts", "", { flag: "a" })
await run("npx", ["tsc", "--noEmit"])
