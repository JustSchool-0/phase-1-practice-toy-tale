const TOYS_ENDPOINT = 'http://localhost:3000/toys';

let addToy = false;

document.addEventListener("DOMContentLoaded", async () => {
    await buildDisplay();
    setupButtons();
});

function setupButtons() {
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

    const toyForm = document.querySelector(".add-toy-form");
    toyForm.addEventListener('submit', () => {
        const formData = new FormData(toyForm);

        fetch(`${TOYS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': formData.get('name'),
                'image': formData.get('image'),
                'likes': 0,
            })
        }).catch(reportError)
    });
}

async function buildDisplay() {
    const parent = document.querySelector('#toy-collection');
    parent.replaceChildren();
    await fetch(`${TOYS_ENDPOINT}`)
        .then(async res => {
            const json = await res.json();
            json.forEach((data, index) => {
                const toyId = `${data.id}`;

                const card = document.createElement('div');
                card.classList.add('card');

                const heading = document.createElement('h2');
                heading.innerText = `${data.name}`;
                card.appendChild(heading);

                const img = document.createElement('img');
                img.setAttribute('src', data.image);
                img.classList.add('toy-avatar');
                card.appendChild(img);

                const p = document.createElement('p');
                p.innerText = `${data.likes} Likes`;
                card.appendChild(p);

                const button = document.createElement('button');
                button.setAttribute('id', toyId);
                button.classList.add('like-btn');
                button.innerText = "Like ❤️";
                button.addEventListener('click', () => {
                    fetch(`${TOYS_ENDPOINT}/${toyId}`, {
                        method: 'GET'
                    }).then(async (res) => {
                        if (res.ok) {
                            const json = await res.json();
                            const updatedLikes = json.likes + 1;
                            fetch(`${TOYS_ENDPOINT}/${json.id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    'likes': updatedLikes
                                })
                            }).then(async (res) => {
                                if (res.ok) {
                                    p.innerText = `${updatedLikes} Likes`;
                                }
                            }).catch(reportError)
                        }
                    }).catch(reportError)
                });
                card.appendChild(button);

                parent.appendChild(card);
            });
        }).catch(reportError);
}