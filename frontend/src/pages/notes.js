import { CircularProgress, Backdrop, Box, Grid, Paper, Container } from '@mui/material';
import * as React from 'react';
import { useRecoilState } from 'recoil'
import { notesState } from '../state/notesAtom'
import { tokenState } from '../state/tokenAtom'
import NoteList from '../components/NoteList';
import Note from '../components/Note';
import CreateNote from '../components/CreateNode';
import loadNoteList from '../axiosCall/loadNoteList';
import loadNote from '../axiosCall/loadNote';
import deleteNote from '../axiosCall/deleteNote';
import createNote from '../axiosCall/createNote';
import editNote from '../axiosCall/editNote';


function NotesPage() {
    const [dataLoaded, setDataLoaded] = React.useState(false)
    const [notes, setNotes] = useRecoilState(notesState)
    const [token, setToken] = useRecoilState(tokenState)
    const [selectedNote, setSelectedNote] = React.useState()
    const [action, setAction] = React.useState('none') //1. none, 2. view 3. edit

    const onNoteSelected = (note) => {
        loadNote(note.id, token, (note) => {
            setSelectedNote(note)
            setAction('view')
        })
    }

    const onNotesLoaded = (notesList) => {
        setDataLoaded(true)
        setNotes(notesList)
    }

    const onNoteClosed = () => {
        setSelectedNote(null)
        setAction('none')
    }

    const onNoteDeleted = (noteId) => {
        deleteNote(noteId, token, () => {
            setNotes(notes.filter((item) => (item.id != noteId)))
            setSelectedNote(null)
            setAction('none')
        })
    }

    const onNoteEdited = (note) => {
        editNote(note, token, () => {
            setSelectedNote(note)
            setAction('view')
        })
    }

    const onEditClicked = (note) => {
        setSelectedNote(note)
        setAction('edit')
    }

    const onNoteSubmitted = (note) => {
        createNote(note, token, (submitedNote) => setNotes([...notes, submitedNote]))
    }

    if (!dataLoaded) {
        loadNoteList(token, onNotesLoaded)
    }

    return (
        <Box height="100vh">
            <Grid container sx={{height: '100%'}}>
                <Grid item xs={2} height='100%'>
                    <Paper variant='outlined' sx={{height: '100%'}}>
                        <NoteList notes={notes} onNoteSelected={onNoteSelected} />
                    </Paper>
                </Grid>
                <Grid item xs={10}>
                    <Container maxWidth='md' sx={{pt: 8, mt: 16}}>
                        {action === 'view' ? <Note {...selectedNote} onClose={onNoteClosed} onEdit={onEditClicked} onDelete={onNoteDeleted} /> 
                                    : action === 'none' ? <CreateNote onSubmit={onNoteSubmitted} /> : <CreateNote note={selectedNote} onSubmit={onNoteEdited} />}
                    </Container>
                </Grid>
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={!dataLoaded}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default NotesPage;