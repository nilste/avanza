// ==UserScript==
// @name         Avanza
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add a share column to get an overview of your account
// @author       Stefan Nilsson
// @match        avanza.se/min-ekonomi/innehav/konton.*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fetch the overview table
    const tableElement = document.querySelector('.positions');

    // Fetch the total amount on the account
    const tableSummary = tableElement.querySelector('.tableSummary td.value');
    const totalSum = parseFloat(tableSummary.innerText.replace(/\s+/g, ''));

    // Create a new column for the header
    const tableHeader = tableElement.querySelector('thead > tr');
    const newHeader = document.createElement('th');
    newHeader.classList.add('tRight');

    // Create a new link for the header
    const newHeaderLink = document.createElement('a');
    newHeaderLink.setAttribute('href', 'javascript:void(0)');
    newHeaderLink.innerText = 'Andel %';
    newHeader.appendChild(newHeaderLink);

    // Update the header
    const headerData = tableHeader.querySelectorAll('th');
    const headerNewRow = document.createElement('tr');
    for (let i = 0; i !== 12; ++i) {
        if (i === 11) {
            headerNewRow.appendChild(newHeader);
        }
        headerNewRow.appendChild(headerData[i]);
    }
    tableHeader.innerHTML = headerNewRow.innerHTML;

    // Update all rows with the percentage
    const tableBody = tableElement.querySelectorAll('.tablesorter > tbody > tr');
    tableBody.forEach(row => {
        const amount = Number.parseFloat(row.children[8].innerText.replace(/\s+/g, ''))
        const percentage = Number.parseFloat(amount / totalSum * 100).toFixed(2);

        const newColumn = document.createElement('td');
        newColumn.classList.add('tRight');
        newColumn.innerText = percentage;

        const tableData = row.querySelectorAll('td');
        const newTableRow = document.createElement('tr');

        for (let i = 0; i !== 12; ++i) {
            if (i === 11) {
                newTableRow.appendChild(newColumn);
            }
            newTableRow.appendChild(tableData[i]);
        }

        row.innerHTML = newTableRow.innerHTML;
    });
})();
