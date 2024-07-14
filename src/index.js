let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.getElementById('toy-form');
  const toysUrl = 'http://localhost:3000/toys';

  // Fetch and display toys
  fetch(toysUrl)
      .then(response => response.json())
      .then(data => {
          data.forEach(toy => addToyCard(toy));
      });

  // Function to create and add a toy card to the DOM
  function addToyCard(toy) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
      toyCollection.appendChild(card);

      // Add event listener to the like button
      card.querySelector('.like-btn').addEventListener('click', () => {
          updateLikes(toy);
      });
  }

  // Add a new toy
  toyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = e.target.name.value;
      const image = e.target.image.value;

      fetch(toysUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              name,
              image,
              likes: 0
          })
      })
      .then(response => response.json())
      .then(newToy => addToyCard(newToy));

      // Clear the form
      e.target.reset();
  });

  // Update likes
  function updateLikes(toy) {
      const newLikes = toy.likes + 1;
      
      fetch(`${toysUrl}/${toy.id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(updatedToy => {
          const card = document.getElementById(updatedToy.id).closest('.card');
          card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
      });
  }
});
