function crossItem(textId, checkboxId) {
    let text = document.getElementById(textId);
    let checkbox = document.getElementById(checkboxId);
    let form = checkbox.closest('form');

    if (form) {
        let hiddenInput = form.querySelector('input[name="list_status"]');
        hiddenInput.value = checkbox.checked ? "done" : "undone";

        if (checkbox.checked) {
            text.style.textDecoration = "line-through";
        } else {
            text.style.textDecoration = "none";
        }

        fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.error("No form found");
    }
}

function addList(text) {
    const formData = new FormData();
    let url = `/add_list/`
    formData.append('text', text);
    fetch(url, {
            method: "POST",
            body: formData
        })

        .then(response => response.json())
        .then(data => {
            console.log('Data received from server:', data);

            if (data && data.success) {
                let new_item = data['new_item'];
                const table = document.getElementById("listTable");
                let newRow = document.createElement("tr");
                newRow.setAttribute("id", `listRow${new_item.id}`)
                newRow.innerHTML = `
   <td>
                      <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteList('${new_item.id}')">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
   <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
   <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
   </svg>
               </button>
                   </td>
                 <td>
                     <div>
                         <form method="post" action="/change_list_status/${new_item.id}">
                             <input type="hidden" name="list_status" value="${new_item.done ? 'done' : 'undone'}">
                             <input class="form-check-input" type="checkbox" id="myCheck${new_item.id}" value="" aria-label="..." onclick="crossItem('new_item_title${new_item.id}', 'myCheck${new_item.id}')" ${new_item.done ? 'checked' : ''}>
                             <button type="submit" style="display: none;"></button>
                         </form>
                     </div>
                 </td>
                 <td colspan="2" class="align-middle">
                     <div class="d-flex">
                         <div class="accordion-item">
                             <h2 class="accordion-header">
                                 <button class="accordion-button collapsed custom-button fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${new_item.id}" aria-expanded="false" aria-controls="collapse${new_item.id}" id="list_title${new_item.id}">
                                     ${new_item.text}
                                 </button>
                             </h2>
                             <div id="collapse${new_item.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                 <div class="accordion-body">
                                     <table class="table-dark table-borderless" id="thingstable${new_item.id}"></table>
                                     <button type="button" class="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal${new_item.id}">Add</button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </td>
             `;

                table.appendChild(newRow);

                const myModalEl2 = document.getElementById('staticBackdrop');
                const modal2 = bootstrap.Modal.getInstance(myModalEl2);
                modal2.hide();

                // Append modal for new item
                const modalParent = document.getElementById('modalParent');
                const modalElement = document.createElement('div');
                modalElement.innerHTML = `
                 <div class="modal fade" id="exampleModal${new_item.id}" tabindex="-1" aria-labelledby="exampleModalLabel${new_item.id}" aria-hidden="true">
                    <div class="modal-dialog">
                       <div class="modal-content">
                          <div class="modal-header">
                             <h5 class="modal-title" id="exampleModalLabel${new_item.id}">Add new item to ${new_item.text}</h5>
                             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <form method="post" action="/add_thing_to_do/${new_item.id}">
                             <div class="modal-body">
                                <div class="mb-3">
                                   <label for="exampleTitle2" class="form-label"></label>
                                   <input type="text" class="form-control" id="exampleTitle2" name="text">
                                </div>
                             </div>
                             <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-light" onclick="addThing(document.getElementById('exampleTitle2').value, ${new_item.id})">Add</button>
                             </div>
                          </form>
                       </div>
                    </div>
                 </div>
             `;
                modalParent.appendChild(modalElement);
            } else {
                console.error("Adding new item failed.");
            }
        })
        .catch(error => console.error(error));

}


function addThing(text, list_id) {
    const formData = new FormData();
    formData.append('text', text);

    let url = `/add_thing_to_do/${list_id}`;
    console.log(url)
    console.log(text)
    fetch(url, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data received from server:', data);
            if (data && data.success) {
                let new_item = data["new_item"];
                let table = document.getElementById(`thingstable${new_item.list_id}`);
                let newRow = document.createElement("tr");
                newRow.setAttribute("id", `thingstodoRow${new_item.id}`)
                newRow.innerHTML = ` <td>
                      <button type="button" class="btn btn-outline-light btn-sm" onclick="deleteThing(${new_item.id})">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
   <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
   <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
   </svg>
               </button>
                   </td>
   <td>
                                     <form method="post" action="/change_list_status/${new_item.id}">
                                         <input type="hidden" name="list_status" value="${new_item.done ? 'done' : 'undone'}">
                                         <input class="form-check-input light" type="checkbox" id="myCheck${new_item.id}" value="" aria-label="..." onClick="crossItem('thing_title${new_item.list_id}_${new_item.id}', 'myCheck${new_item.id}')" ${new_item.done ? 'checked' : ''}>
                                         <button type="submit" style="display: none;"></button>
                                     </form>
                                 </td>
                                 <td>
                                     <label class="form-check-label ${new_item.done ? 'text-decoration-line-through' : ''}" for="myCheck${new_item.id}" id="thing_title${new_item.list_id}_${new_item.id}">${new_item.text}</label>
                                 </td>`;
                table.appendChild(newRow);



                const myModalEl2 = document.getElementById('exampleModal' + new_item.list_id)
                const modal2 = bootstrap.Modal.getInstance(myModalEl2);
                modal2.hide();
            } else {
                console.error("Adding new item failed.");
            }
        })
        .catch(error => console.error(error));
}

function deleteList(listId) {
    fetch(`/delete_things_to_do/${listId}`, {
            method: "POST"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete things to do associated with the list.");
            }
            return fetch(`/delete_list/${listId}`, {
                method: "POST"
            });
        })

        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete the list.");
            }
            let tableRow = document.getElementById("listRow" + listId);
            tableRow.innerHTML = "";
        })
        .catch(error => {
            console.error("Error:", error);
        });

}

function deleteThing(thingId) {
    fetch(`/delete_thing_to_do/${thingId}`, {
            method: "POST"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete things to do associated with the list.");
            }
            let tableRow = document.getElementById("thingstodoRow" + thingId);
            tableRow.innerHTML = "";
        });
}
