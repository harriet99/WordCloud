import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import '../index.css';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import UpdateIcon from '@material-ui/icons/Update';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

const databaseURL = "https://word-cloud-c8296-default-rtdb.firebaseio.com/";
// const apiURL = "http://localhost:5000";
const apiURL = "https://wordcloudserver-b674510f59de.herokuapp.com/";

const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
})

function Detail(props) {
    const { textID } = useParams();
    const [dialog, setDialog] = useState(false);
    const [textContent, setTextContent] = useState('');
    const [words, setWords] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const [maxCount, setMaxCount] = useState(30);
    const [minLength, setMinLength] = useState(1);

    useEffect(() => {
        _getText();
        _getWords();
        _getImage();
    }, [textID]);

    const _getText = () => {
        fetch(`${databaseURL}/texts/${textID}.json`).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(text => setTextContent(text['textContent']));
    }

    const _getWords = () => {
        fetch(`${databaseURL}/words.json`).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(words => setWords(words || {}));
    }

    const _getImage = () => {
        fetch(`${apiURL}/validate?textID=${textID}`).then(res => {
            if(res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            if(data['result'] === true) {
                setImageUrl(`${apiURL}/outputs?textID=${textID}`);
            } else {
                setImageUrl('NONE');
            }
        });
    }

    const handleDialogToggle = () => setDialog(!dialog);

    const handleValueChange = (e) => {
        let value = e.target.value;
        if (e.target.name === "maxCount") {
            setMaxCount(value % 1 === 0 && value > 1 ? value : 1);
        } else if (e.target.name === "minLength") {
            setMinLength(value % 1 === 0 && value > 1 ? value : 1);
        }
    };

    const handleSubmit = () => {
        setImageUrl('READY');
        const wordCloud = {
            textID,
            text: textContent,
            maxCount,
            minLength,
            words
        };
        handleDialogToggle();
        if (!wordCloud.textID || !wordCloud.text || !wordCloud.maxCount || !wordCloud.minLength || !wordCloud.words) {
            return;
        }
        _post(wordCloud);
    }

    const _post = (wordCloud) => {
        fetch(`${apiURL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wordCloud)
        }).then(res => {
            if(res.status !== 200) {
                res.text().then(text => {
                    console.error("Server Error:", text);
                    throw new Error(res.statusText);
                });
            }
            return res.json();
        }).then(() => {
            setImageUrl(`${apiURL}/outputs?textID=${textID}`);
        });
    }

    const { classes } = props;
  
    return (
        <div>
            <Card>
                <CardContent>
                    {
                        imageUrl && (imageUrl === 'READY' ? 'Loading the word cloud image.' :
                        (imageUrl === 'NONE' ? 'Please create a word cloud for the text.' :
                            <img key={Math.random()} src={`${imageUrl}&random=${Math.random()}`} style={{width: '100%'}}/>))
                    }
                </CardContent>
            </Card>
            <Fab color="primary" className={classes.fab} onClick={handleDialogToggle}>
                <UpdateIcon />
            </Fab>
            <Dialog open={dialog} onClose={handleDialogToggle}>
                <DialogTitle>Create Word Cloud</DialogTitle>
                <DialogContent>
                        <TextField label="Maximum number of words" type="number" name="maxCount" value={maxCount} onChange={handleValueChange} /><br/>
                        <TextField label="Minimum length of a word" type="number" name="minLength" value={minLength} onChange={handleValueChange} /><br/>
                    </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {imageUrl === 'NONE' ? 'Create' : 'Re-create'}
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleDialogToggle}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withStyles(styles)(Detail);
