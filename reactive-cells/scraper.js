export class TableScraper {
  #table;
  doc;
  constructor() {



    // new HTMLTableSectionElement().rows
  }

  get table() {
    if (!(!!this.#table) || this.#table.constructor != HTMLTableElement) return null;

    return this.#table
  }

  get columnNames() {
    return this.headerCells.map(this.#getCellContent)
  }

  get headerCells() {
    return [...this.thead.rows[0].cells] || null;
  }

  get dataBodyRows() {
    if (!this.tbody || this.tbody.constructor != HTMLTableSectionElement) return;


    return [...this.tbody.rows] || null;
  }

  get thead() {
    return this.table.tHead || null;
  }

  get tbody() {
    return this.table.tBodies[0] || null;
  }

  scrape() {
    if (!(!!this.table) || this.table.constructor != HTMLTableElement) return null;

    const rows = this.dataBodyRows
      .map((row, i) => {
        return this.#getRowContent(row)
      });


    // this.table = doc.body.querySelector(selector);

    return rows;
  }

  setSourceDocument(doc) {
    if (!doc || doc.constructor != Document) return;

    this.doc = doc

    return this.table;
  }

  setSourceTable(table) {
    if (!table || table.constructor != HTMLTableElement) return;

    this.#table = table

    return this.table;
  }

  #getCellContent(cell) {
    if (!cell || !(cell.tagName.toUpperCase() == 'TD' ||cell.tagName.toUpperCase() == 'TH')) throw new Error('Not a table cell')

    const cellData = {
      content: null,
      href: null,
      cellIndex: cell.cellIndex,
    }

    if (!!cell.firstElementChild) {
      cellData.content = cell.firstElementChild.textContent.trim();
      cellData.href = cell.firstElementChild.constructor === HTMLAnchorElement ? cell.firstElementChild.href : null;
    }

    else {
      cellData.content = cell.textContent;
    }

    return cellData;
  }

  #getRowContent(row) {
    if (!row || row.constructor != HTMLTableRowElement) throw new Error('Not a table row')

    const rowData = {
      rowIndex: row.rowIndex,
      cells: [...row.cells].reduce((acc, curr, i) => {
        return { ...acc, [this.columnNames[i]]: { ...this.#getCellContent(curr), rowIndex: row.rowIndex } }
      }, {}),
    }

    return rowData;
  }

  #getTableContent() {
    if (!this.tbody || this.tbody.constructor != HTMLTableSectionElement) throw new Error('No table tbody')
  }


}
