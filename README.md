# RTF Parsing Test

This project is a working code snippet of the rtf-parser npm module, which will be built into other projects.

The rtf-parser module splits each line item and whitespace item out into what looks like a JSON array. It then has to be recompiled in this instance to replicate a CSV record, starting a newline at the start of each record.

Reminders 1 and 2 are processed the same providing the field layout in the templates is the same.

## Applied to all Ctx templates

- Run two comma removal processes.
- Divide the Summons court costs field in two.

### Ctx Reminder 1

- Remove form feed character at the start of the file.
- Remove first blank line.
- If field 11 is blank, remove it as this is an additional address line where 6 or more address fields occur.
- Line 17 might contain an additional financial year value, as the bill might be multi-year.

### Ctx Reminder 2

- Remove first blank line.
- Remove empty line after 'REM2'. 

### Ctx Final Notice

- Remove first two blank lines.

### Ctx Summons

- Remove header.

## Applied to all Ndr templates

- Run two comma removal processes.

### Ndr Reminder

- Nothing appears to require changing.

### Ndr Final Notice

- Remove first blank line.
- Remove empty line after 'NNDR F'.

### Ndr Summons

- Not currently a workable template.

## Applied to all Bid templates

- Run two comma removal processes.

### Bid Reminder

- No alterations required.

### Bid Final Notice

- Not yet available.

### Bid Summons

- Not yet available.