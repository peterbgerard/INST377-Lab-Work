function dataHandler(array) {
    // Shuffle array - Googled this
    let shuffled = array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

    // Get sub-array of first 15 elements after shuffled
    let selected = shuffled.slice(0, 15);

    return selected
  }
  
  // Add the contents of options[0] to #foo:
  //document.getElementById('foo').appendChild(makeUL(options[0]));

async function mainEvent() { // the async keyword means we can make API requests
  const form = document.querySelector('.main_form')
  const submit = document.querySelector('.button');
  submit.style.setProperty('display', 'none');

  const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object
  
  // get a list of 15 random restaurant names from the data
  rest_names = dataHandler(arrayFromJson);  
  
  console.log(rest_names)

  document.getElementById('resto-list').innerHTML = rest_names.map(item => `<li>${ item['name'] }</li>`).join('');
    
  // don't show the button until the data is ready
  if (arrayFromJson.length > 0) {
    submit.style.setProperty('display', 'block');
    
    form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      // console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
    })
  }
}

// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests

/*

Using dot notation and template strings (`this ${variable} kind`} to build some HTML strings, 
then use innerHTML inject your collection of random restaurants into the list you made in step 13.
A CodePen example of dot notation vs bracket notation (Links to an external site.)
ES6 - How to write strings with variables included (Links to an external site.)
You'll need to have the unordered list as a target, so don't forget your querySelector()
The list should refresh with different content every time your form is submitted, 
ie: it should change when you hit the submit button.
The new list should replace the old one entirely, not append.
 
*/