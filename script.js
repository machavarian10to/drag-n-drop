const dropZone = document.querySelector(".drop-zone");

// Activate item for dragging
function drag(event){
    event.dataTransfer.setData('text/plain', event.target.id);
}

// Prevents default drop behavior
function allowDrop(event) {
    event.preventDefault();
}

// Prevents drop propagation
function preventDrop(event){
    event.stopPropagation();
}

// Handles the drop event
function dropCard(event) {
    event.preventDefault(); 
    const cardId = event.dataTransfer.getData("text");

    // Checks if the card is already dropped
    const cardIsDropped = dropZone.querySelector(`#${cardId}`);
    if(cardIsDropped) return;

    // Checks card module dependencies
    const card = document.getElementById(cardId)
    const isContingenciesTrue = checkContingencies(card, cardId);
    if(!isContingenciesTrue) return;

    // Append card to dropzone
    if(cardId === "liveness-check" || cardId === "video-call-verification"){
        const disabledInputs = card.querySelectorAll('input[disabled]');
        disabledInputs.forEach(input => input.removeAttribute('disabled'));
        const cardTexts = card.innerText.split("\n");
        const [cardTitle, firstRadioText, secondRadioText] = cardTexts;
        appendRadioCard(cardId, cardTitle, firstRadioText, secondRadioText, event)
    }else {
        const cardText = card.innerText;
        appendDefaultCard(cardId, cardText, event);
    }

    // Check if there is a card above the newly dropped card and update card's svg
    const droppedCards = Array.from(dropZone.querySelectorAll('.dropped-card'));
    const droppedCardIndex = droppedCards.findIndex(droppedCard => droppedCard.id === cardId);
    const aboveCard = droppedCards[droppedCardIndex - 1];
    if (aboveCard) aboveCard.querySelector(".cards-connection").style.display = "block";
    scaleDropzone(droppedCards);
}

function checkContingencies(card, id){
    if(id === "id-verification"){
        const dropZoneCard = dropZone.querySelector("#id-in-selfie-verification");

        if(dropZoneCard) {
            const idInSelfieVerify = document.querySelector("#id-in-selfie-verification");
            idInSelfieVerify.classList.remove("dropped-card");
            disableCardStyles(idInSelfieVerify);

            const droppedCards = Array.from(dropZone.querySelectorAll('.dropped-card'));
            const lastCard = droppedCards[droppedCards.length - 1];
            if(lastCard) lastCard.querySelector(".cards-connection").style.display = "none";
            scaleDropzone(droppedCards);
            dropZone.removeChild(dropZoneCard);
        } 
    }else if(id === "id-in-selfie-verification"){
        const idVerify = dropZone.querySelector("#id-verification");
        if(idVerify) return false;
    }else if(id === "id-databases-check" || id === "aml-screening" || id === "age-verification"){
        const idInSelfieVerify = dropZone.querySelector("#id-in-selfie-verification");
        const idVerify = dropZone.querySelector("#id-verification");
        if(!idInSelfieVerify && !idVerify) return false;
    }else if(id === "face-match"){
        const idVerify = dropZone.querySelector("#id-verification");
        const livenessCheck = dropZone.querySelector("#liveness-check");
        const idInSelfieVerify = dropZone.querySelector("#id-in-selfie-verification");
        if(!(idVerify && livenessCheck) && !idInSelfieVerify) return false;
    }

    card.classList.toggle("active");
    card.style.cursor = "default";
    card.querySelector('.toggle').style.cursor = "pointer";
    card.querySelector('.svg-disabled').style.display = "none";
    card.querySelector('.svg-active').style.display = "block";
    card.setAttribute("draggable", false);
    return true;
}


function appendDefaultCard(id, text, e) {
    const card = `
      <div class="card dropped-card" id="${id}" ondrop="preventDrop(event)">
          <div class="rectangle">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.75 15H11.6C10.3399 15 9.70982 15 9.22852 14.7548C8.80516 14.539 8.46095 14.1948 8.24524 13.7715C8 13.2902 8 12.6601 8 11.4V6.6C8 5.33988 8 4.70982 8.24524 4.22852C8.46095 3.80516 8.80516 3.46095 9.22852 3.24524C9.70982 3 10.3399 3 11.6 3H11.75M11.75 15C11.75 15.8284 12.4216 16.5 13.25 16.5C14.0784 16.5 14.75 15.8284 14.75 15C14.75 14.1716 14.0784 13.5 13.25 13.5C12.4216 13.5 11.75 14.1716 11.75 15ZM11.75 3C11.75 3.82843 12.4216 4.5 13.25 4.5C14.0784 4.5 14.75 3.82843 14.75 3C14.75 2.17157 14.0784 1.5 13.25 1.5C12.4216 1.5 11.75 2.17157 11.75 3ZM4.25 9L11.75 9M4.25 9C4.25 9.82843 3.57843 10.5 2.75 10.5C1.92157 10.5 1.25 9.82843 1.25 9C1.25 8.17157 1.92157 7.5 2.75 7.5C3.57843 7.5 4.25 8.17157 4.25 9ZM11.75 9C11.75 9.82843 12.4216 10.5 13.25 10.5C14.0784 10.5 14.75 9.82843 14.75 9C14.75 8.17157 14.0784 7.5 13.25 7.5C12.4216 7.5 11.75 8.17157 11.75 9Z" stroke="#591EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>
          <h4>${text}</h4>
          <div class="check-circle">
              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.74996 10L8.24996 12.5L13.25 7.5M17.8333 10C17.8333 14.6024 14.1023 18.3333 9.49996 18.3333C4.89759 18.3333 1.16663 14.6024 1.16663 10C1.16663 5.39763 4.89759 1.66667 9.49996 1.66667C14.1023 1.66667 17.8333 5.39763 17.8333 10Z" stroke="#00B772" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>

          <div class="connector-wrapper">
            <div class="connector">
                <svg width="2" height="8" viewBox="0 0 2 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7V1" stroke="#A9B2FF" stroke-width="2" stroke-miterlimit="0" stroke-linecap="round" stroke-linejoin="bevel"/>
                </svg>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.8333 12.9998C22.8333 18.4306 18.4308 22.8332 13 22.8332C7.56916 22.8332 3.16663 18.4306 3.16663 12.9998C3.16663 7.56904 7.56916 3.1665 13 3.1665C18.4308 3.1665 22.8333 7.56904 22.8333 12.9998Z" fill="#D5D9FF" stroke="#A9B2FF" stroke-width="2"/>
                    <path d="M13 8.66666V17.3333M8.66663 13H17.3333" stroke="#591EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="cards-connection" width="2" height="8" viewBox="0 0 2 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7V1" stroke="#A9B2FF" stroke-width="2" stroke-miterlimit="0" stroke-linecap="round" stroke-linejoin="bevel"/>
                </svg>
            </div>
          </div>
      </div>
    `;
    e.target.insertAdjacentHTML('beforeend', card);
}

function appendRadioCard(id, text, firstRadio, secondRadio, e){
    const card = `
    <div class="card dropped-card radio-options" id="${id}" draggable="true" ondragstart="drag(event)" ondrop="preventDrop(event)">
        <div class="workflow-frame">
            <div class="rectangle">
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.75 15H11.6C10.3399 15 9.70982 15 9.22852 14.7548C8.80516 14.539 8.46095 14.1948 8.24524 13.7715C8 13.2902 8 12.6601 8 11.4V6.6C8 5.33988 8 4.70982 8.24524 4.22852C8.46095 3.80516 8.80516 3.46095 9.22852 3.24524C9.70982 3 10.3399 3 11.6 3H11.75M11.75 15C11.75 15.8284 12.4216 16.5 13.25 16.5C14.0784 16.5 14.75 15.8284 14.75 15C14.75 14.1716 14.0784 13.5 13.25 13.5C12.4216 13.5 11.75 14.1716 11.75 15ZM11.75 3C11.75 3.82843 12.4216 4.5 13.25 4.5C14.0784 4.5 14.75 3.82843 14.75 3C14.75 2.17157 14.0784 1.5 13.25 1.5C12.4216 1.5 11.75 2.17157 11.75 3ZM4.25 9L11.75 9M4.25 9C4.25 9.82843 3.57843 10.5 2.75 10.5C1.92157 10.5 1.25 9.82843 1.25 9C1.25 8.17157 1.92157 7.5 2.75 7.5C3.57843 7.5 4.25 8.17157 4.25 9ZM11.75 9C11.75 9.82843 12.4216 10.5 13.25 10.5C14.0784 10.5 14.75 9.82843 14.75 9C14.75 8.17157 14.0784 7.5 13.25 7.5C12.4216 7.5 11.75 8.17157 11.75 9Z" stroke="#591EFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h4>${text}</h4>
            <div class="check-circle">
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.74996 10L8.24996 12.5L13.25 7.5M17.8333 10C17.8333 14.6024 14.1023 18.3333 9.49996 18.3333C4.89759 18.3333 1.16663 14.6024 1.16663 10C1.16663 5.39763 4.89759 1.66667 9.49996 1.66667C14.1023 1.66667 17.8333 5.39763 17.8333 10Z" stroke="#00B772" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>

        <div class="radio-buttons">
            <div class="radios">
                <input type="radio" name="${id}" id="${firstRadio}" onclick="onRadioChange(event)" />
                <label for="${firstRadio}">${firstRadio}</label>
            </div>

            <div class="radios">
                <input type="radio" name="${id}" id="${secondRadio}" onclick="onRadioChange(event)" />
                <label for="${secondRadio}">${secondRadio}</label>
            </div>
        </div>

        <div class="connector-wrapper">
            <div class="connector">
                <svg width="2" height="8" viewBox="0 0 2 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7V1" stroke="#A9B2FF" stroke-width="2" stroke-miterlimit="0" stroke-linecap="round" stroke-linejoin="bevel"/>
                </svg>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.8333 12.9998C22.8333 18.4306 18.4308 22.8332 13 22.8332C7.56916 22.8332 3.16663 18.4306 3.16663 12.9998C3.16663 7.56904 7.56916 3.1665 13 3.1665C18.4308 3.1665 22.8333 7.56904 22.8333 12.9998Z" fill="#D5D9FF" stroke="#A9B2FF" stroke-width="2"/>
                    <path d="M13 8.66666V17.3333M8.66663 13H17.3333" stroke="#591EFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="cards-connection" width="2" height="8" viewBox="0 0 2 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7V1" stroke="#A9B2FF" stroke-width="2" stroke-miterlimit="0" stroke-linecap="round" stroke-linejoin="bevel"/>
                </svg>
            </div>
      </div>
    </div>
    `;
    e.target.insertAdjacentHTML('beforeend', card);
}
  

// Disables a card and removes it from the drop zone
function disableCard(event) {
    const card = event.target.closest('.card');

    // Checks if the card is already dropped
    const dropZoneCard = dropZone.querySelector(`#${card.id}`);
    if(!dropZoneCard) return;

    disableCardStyles(card);
    dropZoneCard.classList.remove('dropped-card');

    if(card.id === "liveness-check" || card.id === "video-call-verification"){
        const enabledInputs = card.querySelectorAll('input');
        enabledInputs.forEach(input => input.setAttribute('disabled', true));
    }

    dropZone.removeChild(dropZoneCard);
    checkDependencies(card.id);
}

function checkDependencies(id){
    if(id === "id-verification" || id === "id-in-selfie-verification"){
        const idDatabasesCheck = dropZone.querySelector("#id-databases-check");

        if(idDatabasesCheck){
            const idInSelfieVerify = dropZone.querySelector("#id-in-selfie-verification");
            const idVerify = dropZone.querySelector("#id-verification");
            if(idInSelfieVerify || idVerify){
                pass;
            }else {
                const card = document.querySelector("#id-databases-check");
                disableCardStyles(card);
                card.classList.remove('dropped-card');
                dropZone.removeChild(idDatabasesCheck);
            }
        }
    }

    // Remove connection svg if card is last one in dropzone
    const droppedCards = Array.from(dropZone.querySelectorAll('.dropped-card'));
    const lastCard = droppedCards[droppedCards.length - 1];
    if(lastCard) lastCard.querySelector(".cards-connection").style.display = "none";
    scaleDropzone(droppedCards);
}

function disableCardStyles(card){
    card.classList.remove("active");
    card.style.cursor = "move";
    card.setAttribute("draggable", true);
    card.querySelector('.toggle').style.cursor = "move";
    card.querySelector('.svg-disabled').style.display = "block";
    card.querySelector('.svg-active').style.display = "none";
}

function scaleDropzone(cards){
    const totalHeight = cards.reduce((sum, card) => sum + card.offsetHeight, 0);
    const scale = totalHeight > dropZone.offsetHeight / 2 ? dropZone.offsetHeight / (totalHeight * 2) : 1;
    dropZone.style.transform = `scale(${scale})`;
}


function onRadioChange(event) {
    const targetId = event.target.id;
    const radioButtons = document.querySelectorAll(`input[id="${targetId}"]`);
    radioButtons.forEach(radioButton => radioButton.checked = true)
}   
