# MLB Win Probability Calculator 

## About
Web application that calculates the home team's win probability based on a user-inputted scenario.

Try the calculator out [here!](https://kr7d.github.io/win-expectancy/)

## Inputs
| Parameter | Description | Constraints |
| --- | --- | --- |
| Inning | *Integer*: the inning of the scenario | Between 1 and 99 (inclusive) |
| Home lead | *Integer*: how many runs home leads<br> away by | Between -10 and 10 (inclusive)
| Outs | *Integer*: number of outs | Between 0 and 2 (inclusive) |
| Half | *Top, Bottom*: the half of the inning | None |
| Runner on<br>1st Base | *Boolean*: true if 1st base is<br> occupied | None |
| Runner on<br>2nd Base | *Boolean*: true if 2nd base is<br> occupied | None |
| Runner on<br>3rd Base | *Boolean*: true if 3rd base is<br> occupied | None |

## Outputs
| Name | Description |
| --- | --- |
| Home win<br>probability | Probability (in %) that the home team wins, given the inputted scenario |
| Home wins | Number of times the home team ended up winning following this scenario |
| Occurrences | Number of times this scenario has occurred since the year 1900 |

## Notes
Due to data limitations, events from 1901, 1902, and 1904 have been excluded from the calculations.

The information used here was obtained free of
charge from and is copyrighted by Retrosheet.  Interested
parties may contact Retrosheet at 20 Sunset Rd.,
Newark, DE 19711.