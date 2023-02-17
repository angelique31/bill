import VerticalLayout from "./VerticalLayout.js";
import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";

import Actions from "./Actions.js";
//ce fichier est lié au 2e test Bills.test.js
//code pour générer l'interface utilisateur de la page de factures de l'application.
//La fonction row prend en entrée les données de factures et les trie par ordre de date décroissant.
const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `;
};

// Fonction de tri des dates corrigée:

const formatedDate = (item) => {
  const formatMonths = {
    "Jan.": 0,
    "Fév.": 1,
    "Mar.": 2,
    "Avr.": 3,
    "Mai.": 4,
    "Jui.": 5,
    "Juil.": 6,
    "Aoû.": 7,
    "Sept.": 8,
    "Oct.": 9,
    "Nov.": 10,
    "Déc.": 11,
  };

  const getDateArray = (itemDate) => {
    console.log(itemDate);
    console.log(itemDate.date);
    return itemDate.date.split(" ");
  };

  const getFixedMonth = (month) => {
    const correspondenceMonth = formatMonths[month];
    if (correspondenceMonth === undefined) {
      console.log("correspondence", month, correspondenceMonth);
    }

    return correspondenceMonth;
  };

  const getFixedYear = (year) => {
    const currentYear = new Date().getFullYear().toString();
    const currentFormatedYear = currentYear.slice(-2);
    const formatedYear = parseInt(year, 10);

    const fixedYear =
      formatedYear > currentFormatedYear
        ? `19${formatedYear}`
        : `20${formatedYear}`;
    return fixedYear;
  };

  const [day, month, year] = getDateArray(item);
  const dateFormated = {
    year: getFixedYear(year),
    month: getFixedMonth(month),
    day: day,
  };

  const fixedDate = new Date(
    dateFormated.year,
    dateFormated.month,
    dateFormated.day
  );

  return fixedDate;
};

const rows = (data) => {
  console.log(data);
  return data && data.length
    ? data
        .sort((a, b) => {
          return formatedDate(b) - formatedDate(a);
        })
        .map((bill) => row(bill))
        .join("")
    : "";
};

export default ({ data: bills, loading, error }) => {
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `;

  if (loading) {
    return LoadingPage();
  } else if (error) {
    return ErrorPage(error);
  }

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`;
};
