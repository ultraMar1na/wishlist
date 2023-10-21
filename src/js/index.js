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
        alert('Подарунок зарезервовано');
    } else if (updated && !reserved) {
        alert('Резерв скасовано');
    } else {
        console.log('Something went wrong');
    }
}