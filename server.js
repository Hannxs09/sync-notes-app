const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const fs = require("fs")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

const notesFile = path.join(__dirname, "notes.json")

// Notizen aus Datei laden oder leeren
let notes = []
try {
  notes = JSON.parse(fs.readFileSync(notesFile))
} catch(e) {
  notes = []
}

// Socket.IO
io.on("connection", (socket) => {
  // beim Verbinden Notizen senden
  socket.emit("loadNotes", notes)

  // neue Notiz
  socket.on("newNote", (note) => {
    notes.push(note)
    fs.writeFileSync(notesFile, JSON.stringify(notes))
    io.emit("noteAdded", note)
  })

  // Notiz löschen
  socket.on("deleteNote", (note) => {
    notes = notes.filter(n => n !== note)
    fs.writeFileSync(notesFile, JSON.stringify(notes))
    io.emit("noteDeleted", note)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`)
})