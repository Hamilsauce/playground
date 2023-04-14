 function UntitledMacro() {
   let spreadsheet = SpreadsheetApp.getActive();

   spreadsheet.getRange('B4').activate();
   spreadsheet.getCurrentCell().setValue('szxSx');
   spreadsheet.getActiveRange().autoFill(spreadsheet.getRange('B4:B18'), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
   spreadsheet.getRange('B4:B18').activate();
   spreadsheet.getActiveRange().autoFill(spreadsheet.getRange('B4:P18'), SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);
   spreadsheet.getRange('B4:P18').activate();
   spreadsheet.copy('Copy of Untitled spreadsheet');

   let dataSourceSpec = SpreadsheetApp.newDataSourceSpec()
     .asBigQuery()
     .setProjectId('zdp-dev-events')
     .setTableProjectId('bigquery-public-data')
     .setDatasetId('iowa_liquor_sales')
     .setTableId('sales')
     .build();

   SpreadsheetApp.enableAllDataSourcesExecution();
   spreadsheet.insertDataSourceSheet(dataSourceSpec);
   spreadsheet.refreshAllDataSources();
   spreadsheet.getRange('F:F').activate();

   dataSourceSpec = SpreadsheetApp.newDataSourceSpec()
     .asBigQuery()
     .setProjectId('zdp-dev-events')
     .setRawQuery('select * from `bigquery-public-data.iowa_liquor_sales.sales`\nwhere sale_dollars > 100')
     .build();

   let dataSource = spreadsheet.getActiveSheet().asDataSourceSheet().getDataSource();
   dataSource.updateSpec(dataSourceSpec, false);

   let pivotTable = dataSource.createDataSourcePivotTableOnNewSheet();
   spreadsheet.getActiveSheet().setHiddenGridlines(true);
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);

   let pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup.showTotals(false);
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup.showTotals(false);
   pivotGroup = pivotTable.addColumnGroup('category');
   pivotGroup.showTotals(false);
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);

   let pivotValue = pivotTable.addPivotValue('city', SpreadsheetApp.PivotTableSummarizeFunction.COUNTA);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup.showTotals(false);
   pivotGroup = pivotTable.addColumnGroup('category');
   pivotGroup.showTotals(false);
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup.showTotals(false);
   pivotGroup = pivotTable.addColumnGroup('category');
   pivotGroup.showTotals(false);
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);
   pivotValue = pivotTable.addPivotValue('sale_dollars', SpreadsheetApp.PivotTableSummarizeFunction.SUM);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup.showTotals(false);
   pivotGroup = pivotTable.addColumnGroup('category');
   pivotGroup.showTotals(false);
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);
   pivotValue = pivotTable.addPivotValue('sale_dollars', SpreadsheetApp.PivotTableSummarizeFunction.SUM);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup = pivotTable.addColumnGroup('category');
   pivotGroup.showTotals(false);
   spreadsheet.getCurrentCell().getDataSourcePivotTables()[0].refreshData();
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);
   pivotValue = pivotTable.addPivotValue('sale_dollars', SpreadsheetApp.PivotTableSummarizeFunction.SUM);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotTable = spreadsheet.getRange('A1').createDataSourcePivotTable(dataSource);
   pivotValue = pivotTable.addPivotValue('sale_dollars', SpreadsheetApp.PivotTableSummarizeFunction.SUM);
   pivotGroup = pivotTable.addRowGroup('county');
   pivotGroup = pivotTable.addColumnGroup('category_name');
   pivotGroup.showTotals(false);
   spreadsheet.getCurrentCell().getDataSourcePivotTables()[0].refreshData();

   let sheet = spreadsheet.getActiveSheet();

   sheet.getRange(
     1,
     1,
     sheet.getMaxRows(),
     sheet.getMaxColumns()
   ).activate();

   spreadsheet.getActiveSheet().autoResizeColumns(1, 172);

   spreadsheet.getRange('B107:DK107').activate();

   spreadsheet.getActiveRangeList().setNumberFormat('"$"#,##0.00');

   spreadsheet.getRange('B3').activate();

   let currentCell = spreadsheet.getCurrentCell();

   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.NEXT).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.UP).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.UP).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getRange('B3:M106').activate();
   spreadsheet.getActiveRangeList().setNumberFormat('"$"#,##0.00');
   sheet = spreadsheet.getActiveSheet();
   sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).activate();
   spreadsheet.getActiveSheet().autoResizeColumns(1, 172);
   spreadsheet.getRange('B3').activate();
   spreadsheet.setActiveSheet(spreadsheet.getSheetByName('sales'), true);
   spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Pivot Table 1'), true);
   spreadsheet.getRange('A2').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.NEXT).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.NEXT).activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getRange('A2:DK89').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.DOWN).activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getRange('A2:DK106').activate();
   spreadsheet.getRange('A2:DK106').createFilter();
   spreadsheet.getRange('B2').activate();
   spreadsheet.getActiveSheet().getFilter().sort(2, false)
     .sort(2, false);
   spreadsheet.getRange('B6').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getActiveRange().getDataRegion().activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.insertSheet(3);
   spreadsheet.getRange('\'Pivot Table 1\'!A1:DK107').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false);
   spreadsheet.getRange('2:2').activate();
   spreadsheet.getActiveRangeList().setBackground('#6d9eeb')
     .setFontColor('#efefef')
     .setBackground('#1155cc');
   spreadsheet.getRange('C2').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getActiveRange().getDataRegion().activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getRange('A2').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.NEXT).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.NEXT).activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getRange('A2:DK107').activate();
   spreadsheet.getRange('A2:DK107').createFilter();
   spreadsheet.getRange('B2').activate();
   spreadsheet.getActiveSheet().getFilter().sort(2, false);
   spreadsheet.getRange('B3:C107').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.NEXT).activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getActiveRangeList().setNumberFormat('"$"#,##0.00');
   spreadsheet.getRange('BP8').activate();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.PREVIOUS).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.PREVIOUS).activate();
   currentCell.activateAsCurrentCell();
   currentCell = spreadsheet.getCurrentCell();
   spreadsheet.getSelection().getNextDataRange(SpreadsheetApp.Direction.PREVIOUS).activate();
   currentCell.activateAsCurrentCell();
   spreadsheet.getRange('BP1').activate();
   spreadsheet.getCurrentCell().getNextDataCell(SpreadsheetApp.Direction.PREVIOUS).activate();
   spreadsheet.getRange('A102').activate();
 };