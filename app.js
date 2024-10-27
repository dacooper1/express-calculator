const express = require('express');
const MyError = require('./myErrors')
const app = express();
app.use(express.json());



app.get('/mean', function mean(req, res, next) {
    let nums = req.query.nums;
    let sum = 0;
    let count = 0;

    // Split the input string by commas to get individual numbers
    let numArray = nums.split(',');

    for (let num of numArray) {
        num = num.trim(); // Remove any extra spaces

        // Check if it's a valid number
        if (Number.isNaN(parseFloat(num))) {
            return res.json({ error: `${num} is not a number.` });
        } else {
            // Convert to a number and add to sum
            sum += parseFloat(num);
            count++;
        }
    }

    // Calculate the mean if count is greater than 0
    if (count !== 0) {
        let meanValue = sum / count;
        return res.json({response:{
            operation: "mean",
            value: meanValue
        }});
    } else {
        return res.json({ error: "This query is empty." });
    }
});


app.get('/median', function median(req, res, next) {
    let nums = req.query.nums;

    // Process the input: split, trim, parse to numbers, filter valid numbers, and sort
    let numArray = nums
        .split(',')
        .map(num => parseFloat(num.trim()))
        .filter(num => !isNaN(num) && isFinite(num))
        .sort((a, b) => a - b);

    // If the array is empty after filtering, return an error message
    if (numArray.length === 0) {
        return res.json({ error: "No valid numbers provided." });
    }

    // Calculate the median
    const middleIndex = Math.floor(numArray.length / 2);
    let medianValue;

    if (numArray.length % 2 === 0) {
        // If even, the median is the average of the two middle numbers
        medianValue = (numArray[middleIndex - 1] + numArray[middleIndex]) / 2;
    } else {
        // If odd, the median is the middle number
        medianValue = numArray[middleIndex];
    }

    // Send the response as JSON
    res.json({
        operation: "median",
        value: medianValue
    });
});

app.get('/mode', function mode(req, res, next) {
    let nums = req.query.nums;

    // Process the input: split, trim, parse to numbers, filter valid numbers
    let numArray = nums
        .split(',')
        .map(num => parseFloat(num.trim()))
        .filter(num => !isNaN(num) && isFinite(num));

    const frequency = {};

    // Calculate the frequency of each number
    numArray.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
    });


    let mostFrequentItems = [];
    let highestCount = 0;

    // Iterate over the frequency object to find the highest frequency
    for (let item in frequency) {
        if (frequency[item] > highestCount) {
            highestCount = frequency[item];
            mostFrequentItems = [Number(item)]; // Reset and add the new mode
        } else if (frequency[item] === highestCount) {
            mostFrequentItems.push(Number(item)); // Add to the list if it's a tie
        }
    }

    // Send the response as JSON
    res.json({
        operation: "mode",
        value: mostFrequentItems.length === 1 ? mostFrequentItems[0] : mostFrequentItems
    });
});

// app.use((error, req, res, next) => {
//     res.status(error.status).json({error:{msg, status}})
// }) 

app.listen(3000, function () {
  console.log('App on port 3000');
})