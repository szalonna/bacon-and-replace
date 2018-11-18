const {
    Text
} = require('scenegraph');

const $ = sel => document.querySelector(sel);
let dialog;

function createDialog(selection, id = "dialog") {
    const sel = `#${id}`;
    dialog = document.querySelector(sel);
    if (dialog) {
        return dialog;
    }

    document.body.innerHTML = `
<style>
    ${sel} form {
        width: 300px;
    }
    ${sel} .row { align-items: center; }
    #replaceCounter {
        font-size: 12px;
        color: inherit;
        text-align: right;
        width: 300px;
    }
</style>
<dialog id="${id}">
    <form method="dialog">
        <input uxp-quiet="true" type="text" id="searchedValue" placeholder="Search for"/>
        <input uxp-quiet="true" type="text" id="replaceValue" placeholder="Replace with"/>
        <label class="row">
            <input type="checkbox" uxp-quiet="true" id="caseSensitive" />
            <span>Case sensitive</span>
        </label>
        <div id="replaceCounter">
            &nbsp;
        </div>
        <footer>
            <button id="close">Close</button>
            <button type="submit" id="ok" uxp-variant="cta">Bacon and replace</button>
        </footer>
    </form>
</dialog>
`;

    dialog = document.querySelector(sel);

    const [
        form,
        close,
        ok,
        searchedValue,
        replaceValue,
        caseSensitiveCheckbox
    ] = [
        `${sel} form`,
        "#close",
        "#ok",
        "#searchedValue",
        "#replaceValue",
        '#caseSensitive'
    ].map(s => $(s));

    let caseSensitive = false;

    const submitForm = () => {
        searchAndReplace(
            selection,
            searchedValue.value,
            replaceValue.value,
            caseSensitive
        );
    }

    close.addEventListener("click", () => {
        dialog.close();
    });

    const handleSubmitEvent = e => {
        e.preventDefault();
        submitForm();
    };

    ok.addEventListener('click', handleSubmitEvent);
    form.addEventListener('submit', handleSubmitEvent);

    caseSensitiveCheckbox.addEventListener('change', (e) => {
        caseSensitive = !caseSensitive;
    });

    return dialog;
}

function getAllOperableElements(selection) {
    return selection.items
        .filter(item => item instanceof Text);
}

function searchAndReplace(selection, searchValue, replaceValue, caseSensitive = false) {

    const operableElements = getAllOperableElements(selection);

    if (operableElements.length) {
        let matchCount = 0;
        operableElements.forEach(elem => {
            const original = elem.text;
            let flag = 'g';
            if (!caseSensitive) {
                flag += 'i';
            }
            const pattern = new RegExp(searchValue, flag);

            matchCount += (original.match(pattern) || []).length;

            const result = original.replace(pattern, replaceValue);
            elem.text = result;
        });

        $('#replaceCounter').innerHTML = `${matchCount} matched and replaced`
    }
}

async function showSearchAndReplace(selection) {
    await createDialog(selection).showModal();
}

module.exports = {
    commands: {
        showSearchAndReplace
    }
};