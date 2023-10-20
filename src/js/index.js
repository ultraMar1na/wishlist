import { Octokit } from "https://esm.sh/@octokit/core";
import {
    createOrUpdateTextFile
} from "https://esm.sh/@octokit/plugin-create-or-update-text-file";


const MyOctokit = Octokit.plugin(createOrUpdateTextFile);
const octokit = new MyOctokit({ auth: "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" });

var inputs = document.querySelectorAll('.checkbox-gift');

inputs.forEach(function(elem) {
    getPresentStatus(elem);

    elem.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            console.log('checked', event.currentTarget.id);
            updatePresentStatus(event.currentTarget.id, true);
        } else {
            console.log('not checked', event.currentTarget.id);
            updatePresentStatus(event.currentTarget.id, false);
        }
    });
})

async function getPresentStatus (elem) {
    console.log(elem.id);
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

    console.log(result);
}

async function updatePresentStatus (id, reserved) {
    var {
        updated,
        data: {commit},
    } = await octokit.createOrUpdateTextFile({
        owner: 'ultraMar1na',
        repo: 'wishlist',
        path: "gifts/test.txt",
        content: reserved ? "yes" : "no",
        message: 'gift status update',
    });

    if (updated && reserved) {
        alert('Подарунок зарезервовано');
    } else if (updated && !reserved) {
        alert('Резерв скасовано');
    } else {
        console.log('Something went wrong');
    }
}