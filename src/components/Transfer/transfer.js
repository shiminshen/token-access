import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'

// Material UI components
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import LinearProgress from '@material-ui/core/LinearProgress'
import InputAdornment from '@material-ui/core/InputAdornment'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
    marginTop: 50,
    minHeight: 550
  },
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  }));

 

export default function Transfer(props) {

  const [open, setOpen] = useState(true)
  const [finished, setFinished] = useState(true)

  const classes = useStyles()
  const { register, handleSubmit, watch, errors } = useForm()
  const { handleTransferClickState, 
    handleTransferEventChange, 
    transferEvents,
    tokenOwner,
    accountId,
    accountBalance } = props

  const handleClickOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    handleTransferClickState(false)
    setOpen(false)
  };

  const onSubmit = async (values) => {
    event.preventDefault()
    setFinished(false)
    const { sendTo, amount } = values
    console.log('values', values)
 
    let finished = await window.contract.transfer({
                        new_owner_id: sendTo,
                        amount: amount
                    }, process.env.DEFAULT_GAS_VALUE)
    let changed = await handleTransferEventChange()
    if(finished && changed) {
        setFinished(true)
        setOpen(false)
        handleTransferClickState(false)
    }
}

function validate(value) {
  console.log('accountid', accountId)
  if (value != accountId) {
    return true
  } else {
    return false
  }
}
console.log('errors', errors)
console.log('accountbalance', accountBalance)
  return (
    <div>
      
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Transfer Tokens</DialogTitle>
        <DialogContent>
        {!finished ? <LinearProgress className={classes.progress} /> : (
          <DialogContentText style={{marginBottom: 10}}>
            Transfer tokens to another account.
          </DialogContentText>)}
          
          <TextField
            autoFocus
            margin="dense"
            id="sendTo"
            variant="outlined"
            name="sendTo"
            label="Account Id to Transfer to"
            inputRef={register({
                required: true,
                validate: value => value != accountId || <p style={{color:'red'}}>Can not transfer to yourself, please enter a new account</p>
            })}
            placeholder="e.g. otherAccount.testnet"
            fullWidth
          />
          {errors.sendTo?.message}

          <TextField
            id="amount"
            margin="dense"
            variant="outlined"
            name="amount"
            label="Amount"
            placeholder="e.g. 1000000000"
            inputRef={register({
                required: true,
                validate: value => value <= parseInt(accountBalance) || <p style={{color: 'red'}}>You do not have that many tokens to transfer, please lower your transfer amount below your current balance of {accountBalance}.</p>
            })}
            InputProps={{
                endAdornment: <InputAdornment position="end">Tokens</InputAdornment>,
                }}
            fullWidth
            />
            {errors.amount?.message}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit(onSubmit)} color="primary" type="submit">
            Transfer
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
