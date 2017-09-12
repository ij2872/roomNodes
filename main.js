
// A=440 tunning
// Speed of sound = 345 m/s
const frequencies = {
    36.7: 'D1',
    38.9: 'Eb1',
    41.2: 'E1',
    43.6: 'F1',
    46.2: 'Gb1',
    49.0: 'G1',
    51.9: 'Ab1',
    55.0: 'A1',
    58.2: 'Bb1',
    61.7: 'B1',
    65.4: 'C2',
    69.3: 'Db2',
    73.4: 'D2',
    77.7: 'Eb2',
    82.4: 'E2',
    87.3: 'F2',
    92.5: 'Gb2',
    98.0: 'G2',
    103.8: 'Ab2',
    110.0: 'A2',
    116.5: 'Bb2',
    123.4: 'B2',
    130.8: 'C3',
    138.5: 'Db3',
    146.8: 'D3',
    155.5: 'Eb3',
    164.8: 'E3',
    174.6: 'F3',
    185.0: 'Gb3',
    196.0: 'G3',
    207.6: 'Ab3',
    220.0: 'A3',
    233.0: 'Bb3',
    246.9: 'B3',
    264.6: 'C4',
    277.1: 'Db4',
    293.6: 'D4',
    311.1: 'Eb4',
    329.6: 'E4',
    349.2: 'F4',
    369.9: 'Gb4',
    392.0: 'G4',
    415.3: 'Ab4',
    440.0: 'A4',
    466.1: 'Bb4',
    493.8: 'B4',
    523.2: 'C5',
    554.3: 'Db5',
    587.3: 'D5'
};

// __FUNCTIONS__

// ROOM-MODE EQUATION
// @TODO add equation to accept meters
// L,W,H = room length, width, height (ft)
// p,q,r = integers 0,1,2,3
// c = speed of sound, 1,130 ft/sec
// returns mode frequency (Hz)
function roomMode(L, W, H, arr){
    const c = 1130;
    let x = Math.pow(arr[0], 2) / Math.pow(L, 2);
    let y = Math.pow(arr[1], 2) / Math.pow(W, 2);
    let z = Math.pow(arr[2], 2) / Math.pow(H, 2);
    let freq = (c/2) * Math.sqrt(x + y + z);

    return Math.round(freq*10)/10; // <-- uncomment to get exact
}


// return true if all values in array are equal
Array.prototype.allValuesSame = () =>{
    for(let i = 1; i<this.length; i++){
        if(this[i] !== this[0]){
            return false;
        }
    }
    return true;
};

// Compares multi Dim Array & Array: arr1[][], arr2[]
// If elements in arr1 are in arr2, return True
function isDuplicate (arr1, arr2) {

    for(let i=0; i<arr1.length; i++){
         for(let j=0; j<3; j++){

             if(arr1[i][j] === arr2[i]){
                console.log("isDuplicate: true" + "VALUES: " + arr1[i] + ' | ' + arr2);
                return true;
            } else {
                return false;
            }
         }
    }
}

//returns mutli Dim Array of all possible values up to range
function pqrArrayGenerator(range){
    let arr = [1,0,0];
    let result = [];
    for(let a=0; a<range; a++){
        for(let b=0; b<=range; b++){
            for(let c=0; c<=range; c++){
                // console.log(`array[0]: ${arr[0]+a}, ${arr[1]+b}, ${arr[2]+c} `);
                result.push([arr[0]+a, arr[1]+b, arr[2]+c]);
            }
        }
    }
    // console.log(result);
    return result;
}

//Acoustic
let PQR = [];

// INPUT: (2) Max integer that P | Q | R will go up to
// OUTPUT: ['1','0','0'],['0','1','0'] ['0','0','1'],... ['2','0','0']....
// INT VALUES WILL BE RETURNED AS A STRING!
function pqrPermutation(arr) {
    // arr = [1,0,0];

    function swap(a, b){
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    function generate(n){
        if(n === 1 ){
            // console.log(PQR.isDuplicate(arr));
            // if(PQR.isDuplicate(arr)){
            //     console.log("add on to PQR");
            // }


            PQR.push(arr.join().split(','));

            // console.log(arr.join(''));
        } else {
            for (let i = 0; i !==n; i++){
                generate(n - 1);
                swap(n % 2 ? 0 : i, n-1);
            }
        }
    }

    // start the magic and add one
    generate(arr.length);
    // for(let index=1; index<=3; index++){
    //     generate(arr.length);
    //     arr[index] += 1;
    // }

    // Filter
    PQR = Array.from(new Set(PQR.map(JSON.stringify)), JSON.parse);
}

// Returns true if input value is in Frequiencies for equal-tempered scale
function isNote(i_mode){
    for(let note in frequencies){
        if(i_mode == note){

            return true;
        }
    }
    return false;
}

// Return true if input value is near the value of a Frequiency
function isCloseNote(i_mode){
    for(let note in frequencies){
        noteRoundUp = Math.ceil(note);
        noteRoundDown = Math.floor(note);

        if(i_mode == noteRoundDown || i_mode == noteRoundDown){

            return true;
        }
    }
    return false;
}

function closestNote(i_mode){
    for(let note in frequencies){
        noteRoundUp = Math.ceil(note);
        noteRoundDown = Math.floor(note);

        if(i_mode == noteRoundDown || i_mode == noteRoundDown){
            return frequencies[note];
        }
    }

}
//JQUERY
// roomSet: a set containing modes(Hz)
// will append to DOM 'ul's
function roomModeHTML(roomSet){
    roomSet.forEach((i)=>{
        //append bass freq
        if(i <= 250){
            if(isNote(i)){
                $('.modeList-bass').append(`
                    <li style="color:#ff4000"> ${i} - ${frequencies[i]} </li>
                `);
                $('.freqChart').append(`
                    <li>${i}Hz: <span style="color:#ff4000">${frequencies[i]}</span></li>
                `);
            } else if(!isNote(i) && isCloseNote(i)){
                $('.modeList-bass').append(`
                    <li style="color:#e58767"> ${i} - ${closestNote(i)} </li>
                `);
                $('.freqChart-close').append(`
                    <li>${i}Hz: <span style="color:#e58767">${closestNote(i)} </span></li>
                `);
            } else {
                $('.modeList-bass').append(`
                    <li> ${i} </li>
                `);
            }
        }

        //append mid freq
        if(i > 250 && i <= 350){

            //if room mode is in frequency object, add color & note name
            if(isNote(i)){
                $('.modeList-mid').append(`
                    <li style="color:#ff4000"> ${i} - ${frequencies[i]} </li>
                `);
                 $('.freqChart').append(`
                    <li>${i}Hz: <span style="color:#ff4000">${frequencies[i]}</span></li>
                `);
            } else if(!isNote(i) && isCloseNote(i)){
                $('.modeList-mid').append(`
                    <li style="color:#e58767"> ${i} - ${closestNote(i) }</li>
                `);
                $('.freqChart-close').append(`
                    <li>${i}Hz: <span style="color:#e58767">${closestNote(i)} </span></li>
                `);
            } else {
                $('.modeList-mid').append(`
                    <li> ${i} </li>
                `);
            }
        }

    });
    console.log('roomModeHTML run');
}

//Returns set of modes
//input room dimensions
//l: length, w: width, h: height
function roomModeRun(l, w, h){
    let roomModes = [];


    //append room-modes to modes array
    PQR.forEach((i) => {
        roomModes.push(roomMode(l, w, h, i) );//myRoom
    });

    //sort by freq
    roomModes.sort((a,b) =>{
        return a - b;
    });

    //filter duplicates using a set
    let rmSet = new Set();
    roomModes.forEach((i) =>{
        rmSet.add(i);
    });
    return rmSet;
}

//__endFunctions__

// Start generating, then parse all permutations to Array 'PQR'
pqrArrayGenerator(10).forEach(function(arr){
    pqrPermutation(arr);
});

let roomModesSet = roomModeRun(8,12,11.7);




// Add content to DOM
$(document).ready(function(){

    var $inputLength = $("input[name='input-length']");
    let $inputWidth = $("input[name='input-width']");
    let $inputHeight = $("input[name='input-height']");

    //Render data to DOM
    roomModeHTML(roomModesSet);

    //Clear li
    //Clear roomModeSet data
    //Re-calculate room modes
    $('#btnCalc').click(function(){
        $('.modeList-bass, .freqChart, .freqChart-close, .modeList-mid').empty();
        roomModesSet.clear();
        console.log(roomModesSet.size);
        roomModesSet = roomModeRun($inputLength.val(), $inputWidth.val(), $inputHeight.val());
        console.log(roomModesSet.size);
        roomModeHTML(roomModesSet);
    });

});
