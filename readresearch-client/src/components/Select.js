import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function SimpleSelect() {
    const classes = useStyles();
    const [postCategory, setCategory] = React.useState('');

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="category">Category</InputLabel>
                <Select
                    labelId="category"
                    id="category-select"
                    value={postCategory}
                    onChange={handleChange}
                >
                    <MenuItem value={'Social Science'}>Social Science</MenuItem>
                    <MenuItem value={'Physics'}>Physics</MenuItem>
                    <MenuItem value={'Chemistry'}>Chemistry</MenuItem>
                    <MenuItem value={'Mathematics'}>Mathematics</MenuItem>
                    <MenuItem value={'Biology'}>Biology</MenuItem>
                    <MenuItem value={'Litrature'}>Litrature</MenuItem>
                    <MenuItem value={'Politics'}>Politics</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}