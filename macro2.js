// Sub Macro1()

// /Macro1 Macro



Range("fieldList[FIELD_LIST]").Select

Range("schemaTable[Internal ID]").Select


ActiveCell.Replace What = " ", Replacement = "", LookAt = xlPart, _
SearchOrder = xlByRows, MatchCase = False, FormulaVersion = _
xlReplaceFormula2

Cells.Find(What = " ", After = ActiveCell, LookIn = xlFormulas2, LookAt = _ xlPart, SearchOrder = xlByRows, SearchDirection = xlNext, MatchCase = False) _
  .Activate
Cells.FindNext(After = ActiveCell).Activate
End Sub


Sub Macro2()
'
' Macro2 Macro
'

'
Range("fieldList[FIELD_LIST]").Select

ActiveWorkbook.Names.AddName = "fieldListRange", RefersToR1C1 = _ "=fieldList[FIELD_LIST]"
ActiveWorkbook.Names("fieldListRange").Comment = ""

Range("fieldList[FIELD_LIST]").Select

Application.GotoReference = "fieldListRange"
Application.GotoReference = "fieldListRange"

Selection.ApplyNames Names = "fieldListRange",
  IgnoreRelativeAbsolute = True _,
  UseRowColumnNames = True,
  OmitColumn = True,
  OmitRow = True, Order = 1, 
  _ AppendLast = False
  
ActiveSheet.ListObjects("fieldList").Name = "fieldTable"
Range("schemaTable[#Headers]").Select
Range("schemaTable").Select
Range("schemaTable[Internal ID]").Select
Range("schemaTable").Select
Range("schemaTable[[Internal ID]:[nlapiSubmitField]]").Select
Range("fieldTable[FIELD_LIST]").Select
Range("schemaTable[Internal ID]").Select
Range("H15:H171,B3:B14").Select
Range("B3").Activate
Range("H6").Select
Range("fieldTable[FIELD_LIST]").Select

Range("B7").Select
Application.GotoReference = "fieldTable"
Application.GotoReference = "schemaTable"
Range("H18:M18").Select
ActiveWindow.ScrollColumn = 3
ActiveWindow.ScrollColumn = 9
ActiveWindow.ScrollColumn = 10
Range("N14").Select
ActiveCell.FormulaR1C1 = "test"
Range("N15").Select
Application.CutCopyMode = False
ActiveCell.FormulaR1C1 = "=[@[Internal ID]]"
Range("schemaTable[test]").Select
Selection.ListObject.ListColumns.Add
Range("schemaTable[Column1]").Select
End Sub