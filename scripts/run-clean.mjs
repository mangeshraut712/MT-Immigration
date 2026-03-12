import { spawn } from "node:child_process"

const command = process.argv.slice(2).join(" ").trim()

if (!command) {
  console.error("Usage: node scripts/run-clean.mjs \"<command>\"")
  process.exit(1)
}

const suppressedPatterns = [
  "[baseline-browser-mapping] The data in this module is over two months old.",
]

const forwardStream = (stream, writer) => {
  let buffer = ""

  stream.on("data", (chunk) => {
    buffer += chunk.toString()

    let newlineIndex = buffer.indexOf("\n")
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex + 1)
      buffer = buffer.slice(newlineIndex + 1)

      if (!suppressedPatterns.some((pattern) => line.includes(pattern))) {
        writer.write(line)
      }

      newlineIndex = buffer.indexOf("\n")
    }
  })

  stream.on("end", () => {
    if (buffer && !suppressedPatterns.some((pattern) => buffer.includes(pattern))) {
      writer.write(buffer)
    }
  })
}

const child = spawn(command, {
  env: process.env,
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
})

forwardStream(child.stdout, process.stdout)
forwardStream(child.stderr, process.stderr)

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
