import { SUPABASE_KEY } from '../consts';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vxyrwqjwvrynszqhzskk.supabase.co'
const supabase = createClient(supabaseUrl, SUPABASE_KEY);

var activeItem = null;

async function readInitialData() {
    let { data: items, error } = await supabase
        .from('items')
        .select('*');

    if (error) {
        console.error('Error reading data:', error);
    } else {
        console.log(items);
        for (let i = 0; i< items.length; i++) {
            var elem = document.getElementById(items[i]['name']);

            if (elem) {
                elem.checked = items[i]['value'];

                console.log(items[i]['name'], elem.closest('.wishlist-item, li'))

                if (elem.checked) {
                    elem.closest('.wishlist-item, li').classList.add('item-checked');
                } else {
                    elem.closest('.wishlist-item, li').classList.remove('item-checked');
                }
            }
        }

        setCheckboxes();
    }
}

async function updatePresentStatus(id, reserved) {
    const { data, error } = await supabase
        .from('items')
        .update({ value: reserved })
        .eq('name', id)
        .select();
}

readInitialData();
eventHandlers();

function setCheckboxes() {
    let checkboxes = document.querySelectorAll('.checkbox-wrapper input');
    checkboxes.forEach(function(elem) {
        elem.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                event.currentTarget.closest('.wishlist-item').classList.add('item-checked');
            } else {
                event.currentTarget.closest('.wishlist-item').classList.remove('item-checked');
            }
        })
    });

    let miniCheckboxes = document.querySelectorAll('.mini-checkbox-wrapper input');
    miniCheckboxes.forEach(function(elem) {
        elem.addEventListener('change', (event) => {
            
            if (event.currentTarget.checked) {
                event.currentTarget.closest('li').classList.add('item-checked');
            } else {
                event.currentTarget.closest('li').classList.remove('item-checked');
            }
        })
    });
}

function eventHandlers() {
    let items = document.querySelectorAll('.wishlist-item:not(.wide-item)');
    items.forEach(function(elem) {
        elem.querySelector('.item-image img').addEventListener('click', (event) => {
            elem.querySelector('.checkbox-wrapper input').click();
        })
    });

    let inputs = document.querySelectorAll('.wishlist-item input.checkbox-gift'), isConfirmed;
    inputs.forEach(function(input) {
        input.addEventListener('change', (event) => {
            event.preventDefault();
            activeItem = event.currentTarget.id;
            if (event.currentTarget.checked) {
                showPopup('#confirmDialog');
            } else {
                showPopup('#cancelDialog');
            }
        })
    });

    let confirmPopup = document.querySelector('#confirmDialog');
    confirmPopup.querySelector('.confirm-button').addEventListener('click', function() {
        updatePresentStatus(activeItem, true);
        hidePopup('#confirmDialog');
    });

    confirmPopup.querySelector('.cancel-button').addEventListener('click', function() {
        updatePresentStatus(activeItem, false);
        hidePopup('#confirmDialog');

        document.getElementById(activeItem).closest('li, .wishlist-item').classList.remove('item-checked');
        document.getElementById(activeItem).checked = false;
    });

    let cancelPopup = document.querySelector('#cancelDialog');
    cancelPopup.querySelector('.confirm-button').addEventListener('click', function() {
        updatePresentStatus(activeItem, false);
        hidePopup('#cancelDialog');
    });

    cancelPopup.querySelector('.cancel-button').addEventListener('click', function() {
        hidePopup('#cancelDialog');

        document.getElementById(activeItem).closest('li, .wishlist-item').classList.add('item-checked');
        document.getElementById(activeItem).checked = true;
    });

}

function showPopup (popup) {
    var popup = document.querySelector(popup);
    popup.style.display = 'flex';
}

function hidePopup (popup) {
    var popup = document.querySelector(popup);
    popup.style.display = 'none';  
}
