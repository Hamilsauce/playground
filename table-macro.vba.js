 const hyperlinker = () => {

   // hyperlinker Macro

   ActiveSheet.Next.Select
   ActiveSheet.Previous.Select

   ActiveCell.Offset(4, 0).Range("A1").Select
   Range(Selection, Selection.End(xlDown)).Select
   ActiveCell.Offset(1, 0).Range("A1").Select

   ActiveWindow.LargeScroll.ToRight = -1

   ActiveCell.Offset(0, -22).Range("A1").Select

   ActiveSheet.Next.Select
   ActiveSheet.Previous.Select

   Range(Selection, Selection.End(xlDown)).Select
   ActiveCell.Select

   Application.CutCopyMode = False
   ActiveSheet.ListObjects
     .Add(xlSrcRange, Range("$C$6:$C$24"), xlNo)
     .Name = "Table2"

   ActiveCell.Select

   ActiveCell.FormulaR1C1 = "GET_BRANCHES"

   ActiveCell.Range("A1:A20").Select

   ActiveCell.Offset(1, 0).Range("A1").Activate

   Selection.ClearFormats

   ActiveSheet.ListObjects("Table2").TableStyle = ""
   ActiveSheet.ListObjects("Table2").TableStyle = "TableStyleMedium17"

   ActiveCell.Select

   ActiveSheet.ListObjects("Table2").Name = "GET_BRANCHES"
   ActiveSheet.ListObjects("GET_BRANCHES").ShowAutoFilterDropDown = False
   ActiveSheet.ListObjects("GET_BRANCHES").ShowAutoFilterDropDown = True

   ActiveWindow.DisplayGridlines = False

   Windows("test-cov").Activate
   ActiveWindow.WindowState = xlNormal

   ActiveWindow
     .SplitColumn(5)
     .SplitRow(12)
   ActiveWindow
     .SplitColumn(0)
     .SplitRow(0)

   Windows("Book1").Activate
   // End Sub
 }
