import {
  createNote,
  getAllNotes,
  getNote,
  deleteNote,
  updateNote,
} from "../../../libs/notesFuncHandler";

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case "GET": {
        const { userId, plantId } = req.query;

        if (userId && plantId) {
          // Fetch notes for a specific user and plant
          const notes = await getAllNotes(userId, plantId);
          return res.json(notes);
        } else if (req.query.id) {
          // Fetch a specific note by id
          const note = await getNote(req.query.id);
          return res.status(200).json(note);
        } else {
          // Otherwise, fetch all botes
          const notes = await getAllNotes();
          return res.json(notes);
        }
      }
      case "POST": {
        const userId = req.body.userId;
        const plantId = req.body.plantId;
        const message = req.body.message;
        const note = await createNote(
          userId,
          plantId,
          message
        );

        return res.json(note);
      }



      case "PUT": {
        const {  userId, plantId, message } = req.body; 
        const { id } = req.query; 
        try {
          const updatedNote = await updateNote(id, {
            userId,
            plantId,
            message,
          });
          return res.status(200).json(updatedNote);
        } catch (error) {
          console.error("Error updating note:", error);
          return res.status(500).json({ error: "Error updating note" });
        }
      }
      

      case "DELETE": {
        const id = req.query.id;
        const noteDelete = await deleteNote(id);
        return res.json(noteDelete);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
