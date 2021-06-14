import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import {
	Button, Card, Modal, Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle, CardActions, Container, CardContent, Grid, Box, Typography, TextField, InputAdornment,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

function App() {
	var url = "https://expenses0e.herokuapp.com/expense";
	var test_url = 'http://localhost:8080/expense';
	const [listExpense, setListExpense] = useState();
	const [totalExpense, setTotalExpense] = useState();
	const [open, setOpen] = useState(false);
	useEffect(() => {
		getalldetails();
	}, []);

	const [inputField, setInputField] = useState({
		title: '',
		amount: '',
		note: '',
		date: ''
	});

	const [updateField, setUpdateField] = useState({
		id: '',
		updateTitle: '',
		updateAmount: '',
		updateNote: '',
		updateDate: ''
	});
	const inputsHandler = (e) => {

		setInputField({ ...inputField, [e.target.name]: e.target.value })
	}

	const updateHandler = (e) => {

		setUpdateField({ ...updateField, [e.target.name]: e.target.value })
	}
	const getalldetails = () => {
		axios.get(url)
			.then(res => {
				var total = 0;
				var result = res.data;
				result.forEach(element => {
					total = parseFloat(total) + parseFloat(element.amount);
				});
				setTotalExpense(total);
				setListExpense(result);
				console.log(listExpense, "listExpense");
			})
	}

	const addExpense = () => {
		axios.post(url, {
			amount: inputField.amount,
			date: inputField.date,
			note: inputField.note,
			title: inputField.title
		})
			.then(res => {
				console.log(res);
				setInputField({
					title: '',
					amount: '',
					note: '',
					date: ''
				})
				getalldetails();
			});
	}
	const updateExpense = () => {
		console.log(updateField,"updateField")
		axios.post(url+'/update', {
			_id: updateField.id,
			amount: updateField.updateAmount,
			date: updateField.updateDate,
			note: updateField.updateNote,
			title: updateField.updateTitle
		}).then(res => {
			console.log(res,"(req, res) =>")
				setOpen(false);
				getalldetails();
			});
	}
	const deleteExpense = (id) => {
		console.log(id,"id")
		axios.delete(url + '/' + id)
			.then(res => {
				getalldetails();
			});
	}
	const openModel = (user) => {
		console.log(user, "user");
		setOpen(true);
		setUpdateField({
			id: user._id,
			updateTitle: user.title,
			updateAmount: user.amount,
			updateNote: user.note,
			updateDate: user.date
		})

	}
	const handleClose = () => {
		setOpen(false);
	};
	const clear = () => {
		setUpdateField({
			id: '',
			updateTitle: '',
			updateAmount: '',
			updateNote: '',
			updateDate: ''
		})
	};
	return (
		<>
			<Box style={{ backgroundColor: 'aliceblue' }}>
				<Typography variant="h4">
					Expenses<b style={{ float: 'right' }}>Total:{totalExpense}</b>
				</Typography>
			</Box>
			<Grid container style={{ backgroundColor: 'aliceblue' }} spacing={5} >
				<Grid item xs={8} >
					<form autoComplete="off" className='form'>
						<TextField
							margin="dense"
							required
							id="outlined-required"
							label="Title"
							name='title'
							variant="outlined"
							onChange={inputsHandler}
							value={inputField.title}
						/>
						<TextField
							margin="dense"
							required
							id="outlined-required"
							label="Amount"
							name='amount'
							InputProps={{
								startAdornment: <InputAdornment position="start">₹</InputAdornment>
							}}
							variant="outlined"
							onChange={inputsHandler}
							value={inputField.amount}
						/>
						<TextField
							margin="dense"
							id="outlined-required"
							label="Note"
							name='note'
							onChange={inputsHandler}
							variant="outlined"
							value={inputField.note}
						/>
						<TextField
							margin="dense"
							required
							type="Date"
							label="Date"
							name='date'
							format={"MMM Do YY"}
							onChange={inputsHandler}
							variant="outlined"
							value={inputField.date}
						/>
					</form>
					<Button className='submit' variant="contained" onClick={addExpense}>Submit</Button>
				</Grid>

				<Grid item xs={4}>
					{listExpense && listExpense.map((user) => (
						<Card className="card" variant="outlined" >
							<CardContent>
								<Typography   >
									{moment(user.date).format("MMM Do YY")}
								</Typography>
								<br></br>
								<Typography >
									<b >{user.title}</b>
									<span style={{ float: "right" }}>₹{user.amount}
									</span>

								</Typography>
								<br></br>
								<Typography >
									<b>Note:</b>{user.note}
								</Typography>

							</CardContent>
							<CardActions>
								<EditIcon onClick={() => openModel(user)}>

								</EditIcon>
								<DeleteIcon style={{ float: 'right' }} onClick={() => deleteExpense(user._id)}>

								</DeleteIcon>
							</CardActions>
						</Card>

					))}
				</Grid>
			</Grid>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
				<DialogContent>
					<form autoComplete="off" className='form'>
						<TextField
							margin="dense"
							required
							id="outlined-required"
							label="Title"
							name='updateTitle'
							variant="outlined"
							onChange={updateHandler}
							value={updateField.updateTitle}
						/>
						<TextField
							margin="dense"
							required
							id="outlined-required"
							label="Amount"
							name='updateAmount'
							InputProps={{
								startAdornment: <InputAdornment position="start">₹</InputAdornment>
							}}
							variant="outlined"
							onChange={updateHandler}
							value={updateField.updateAmount}
						/>
						<TextField
							margin="dense"
							id="outlined-required"
							label="Note"
							name='updateNote'
							onChange={updateHandler}
							variant="outlined"
							value={updateField.updateNote}
						/>
						<TextField
							margin="dense"
							required
							type="Date"
							label="Date"
							name='updateDate'
							onChange={updateHandler}
							variant="outlined"
							value={updateField.updateDate}
						/>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={updateExpense} color="primary">
						update
          </Button>
					<Button onClick={clear, handleClose} color="primary" autoFocus>
						cancl
          </Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default App;
