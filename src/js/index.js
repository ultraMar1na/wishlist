import { Octokit } from "https://esm.sh/@octokit/core";
import {
    createOrUpdateTextFile
} from "https://esm.sh/@octokit/plugin-create-or-update-text-file";
import { SITE_R, SITE_M, SITE_A, SITE_Y, SITE_N } from '../consts';

var m = SITE_R,
    a = SITE_A,
    r = SITE_M,
    y = SITE_Y,
    n = SITE_N;

const MyOctokit = Octokit.plugin(createOrUpdateTextFile);
const octokit = new MyOctokit({ auth: (m + a + r + 'r' + y + n) });

var inputs = document.querySelectorAll('.checkbox-gift');

inputs.forEach(function(elem) {
    getPresentStatus(elem);

    elem.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            updatePresentStatus(event.currentTarget.id, true);
        } else {
            updatePresentStatus(event.currentTarget.id, false);
        }
    });
})

async function getPresentStatus (elem) {
    if(!elem) {
        return;
    }

    var result = await octokit.request('GET /repos/{owner}/{repo}/contents/gifts/{path}', {
        owner: 'ultraMar1na',
        repo: 'wishlist',
        path: elem.id + '.txt',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (result.data.size === 3) {
        elem.checked = true;
    }
}

async function updatePresentStatus (id, reserved) {
    var {
        updated,
        data: {commit},
    } = await octokit.createOrUpdateTextFile({
        owner: 'ultraMar1na',
        repo: 'wishlist',
        path: "gifts/" + id+ ".txt",
        content: reserved ? "yes" : "no",
        message: 'gift status update',
    });

    if (updated && reserved) {
        alert('Подарунок зарезервовано. Дані оновляться за хвилинку');
    } else if (updated && !reserved) {
        alert('Резерв скасовано. Дані оновляться за хвилинку');
    } else {
        console.log('Something went wrong');
    }
}