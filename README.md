# RTF Parsing Test

This project is a working code snippet of the rtf-parser npm module, which will be built into other projects.

The rtf-parser module splits each line item and whitespace item out into what looks like a JSON array. It then has to be recompiled in this instance to replicate a CSV record, starting a newline at the start of each record.

Reminders 1 and 2 are processed the same providing the field layout in the templates is the same.

## Reminder 1

- Remove form feed character at the start of the file.
- Remove first blank line.
- If field 11 is blank, remove it as this is an additional address line where 6 or more address fields occur.
- Line 17 might contain an additional financial year value, as the bill might be multi-year.

## Reminder 2

- Remove first blank line.
- Remove empty line after 'REM2'. 

## Final Notice

- Remove first two blank lines.

## Summons
- 

## Issues

- Commas in address lines.
