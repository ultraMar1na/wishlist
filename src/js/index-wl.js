import { SUPABASE_KEY } from '../consts';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hwmwnleuebomgzsisjao.supabase.co'
const supabase = createClient(supabaseUrl, SUPABASE_KEY);

async function readInitialData() {
    let { data: wishlist_items, error } = await supabase
        .from('wishlist_items')
        .select('*');

    if (error) {
        console.error('Error reading data:', error);
    } else {
        for (let i = 0; i< wishlist_items.length; i++) {
            var elem = document.getElementById(wishlist_items[i]['name']);

            if (elem) {
                elem.checked = wishlist_items[i]['value'];

                console.log(wishlist_items[i]['name'], elem.closest('.wishlist-item, li'))

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
        .from('wishlist_items')
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
            if (event.currentTarget.checked) {
                isConfirmed = confirm("Ви підтверджуєте резерв?");

                if (isConfirmed) {
                    updatePresentStatus(event.currentTarget.id, true);
                } else {
                    event.currentTarget.checked = false;
                }
            } else {
                isConfirmed = confirm("Ви підтверджуєте скасування резерву?");

                if (isConfirmed) {
                    updatePresentStatus(event.currentTarget.id, false);
                }  else {
                    event.currentTarget.checked = true;
                }
            }
        })
    });
}


