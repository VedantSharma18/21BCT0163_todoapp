import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: 'GET',
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: 'application/json',
            },
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log('Error fetching todos:', err);
            return []; // return an empty array in case of error
        }
    };

    const addTodo = () => {
        const options = {
            method: 'POST',
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: 'application/json',
            },
            data: {
                title: newTodo,
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log('Added new todo:', response.data);
                setTodoData(prevData => [...prevData, response.data.newTodo]);
            })
            .catch((err) => {
                console.log('Error adding todo:', err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: 'DELETE',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log('Deleted todo:', response.data);
                setTodoData(prevData => prevData.filter(todo => todo._id !== id));
            })
            .catch((err) => {
                console.log('Error deleting todo:', err);
            });
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id);
        const options = {
            method: 'PATCH',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done,
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log('Updated todo:', response.data);
                setTodoData(prevData =>
                    prevData.map(todo => (todo._id === id ? response.data : todo))
                );
            })
            .catch((err) => {
                console.log('Error updating todo:', err);
            });
    };

    const editTodo = (id, updatedTitle) => {
        console.log(`Saving edited title: "${updatedTitle}" for todo with id: ${id}`);
        const options = {
            method: 'PUT',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: {
                title: updatedTitle,
            },
        };

        axios
            .request(options)
            .then(function (response) {
                console.log('Response from server after edit:', response.data);
                setTodoData(prevData =>
                    prevData.map(todo => (todo._id === id ? response.data : todo))
                );
                setEditId(null); // Exit edit mode
            })
            .catch((err) => {
                console.log('Error saving edited title:', err);
            });
    };

    const handleEditClick = (id, currentTitle) => {
        setEditId(id);
        setEditTitle(currentTitle);
    };

    const handleSaveClick = () => {
        editTodo(editId, editTitle);
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                            setNewTodo('');
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>

            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : todoData.length > 0 ? (
                    todoData.map((entry) => (
                        <div key={entry._id} className={Styles.todo}>
                            <span className={Styles.infoContainer}>
                                <input
                                    type='checkbox'
                                    checked={entry.done}
                                    onChange={() => {
                                        updateTodo(entry._id);
                                    }}
                                />
                                {editId === entry._id ? (
                                    <input
                                        className={Styles.editInput}
                                        type='text'
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                ) : (
                                    entry.title
                                )}
                            </span>
                            {editId === entry._id ? (
                                <button
                                    id='saveButton'
                                    name='save'
                                    className={Styles.saveButton}
                                    onClick={handleSaveClick}
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    id='editButton'
                                    name='edit'
                                    className={Styles.editButton}
                                    onClick={() => handleEditClick(entry._id, entry.title)}
                                >
                                    Edit
                                </button>
                            )}
                            <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    deleteTodo(entry._id);
                                }}
                            >
                                Delete
                            </span>
                        </div>
                    ))
                ) : (
                    <p className={Styles.noTodoMessage}>
                        No tasks available. Please add a new task.
                    </p>
                )}
            </div>
        </div>
    );
}
