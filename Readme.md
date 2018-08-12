DEFECT :

1.) Run script test.js
Scenario : 
  for AU, account number is 6-9 character long, can be any character
Test payload is ::
{ payment_method: 'SWIFT',
  account_name: 'John Smith',
  account_number: '1',
  bank_country_code: 'AU',
  swift_code: 'ICBCAUBJ',
  aba: '11122233A',
  bsb: '123ADF' }
{ error: 'Length of account_number should be between 7 and 11 when bank_country_code is \'US\'' }

 With missing: account_number_length_AU failed response is returned:

      Uncaught AssertionError: expected { Object (error) } to deeply equal { Object (error) }
      + expected - actual

       {
      -  "error": "Length of account_number should be between 7 and 11 when bank_country_code is 'US'"
      +  "error": "Length of account_number should be between 6 and 9 when bank_country_code is 'AU'"
       }
2.) Scenario : 
  for CN, account number is 8-20 character long, can be any character
  Test payload is ::
{ payment_method: 'SWIFT',
  account_name: 'John Smith',
  account_number: '1234567890ABCDEFGHIJKL',
  bank_country_code: 'CN',
  swift_code: 'ICBCCNBJ',
  aba: '11122233A',
  bsb: '' }
{ error: 'Length of account_number should be between 7 and 11 when bank_country_code is \'US\'' }
   With missing: account_number_length_CN failed response is returned:

      Uncaught AssertionError: expected { Object (error) } to deeply equal { Object (error) }
      + expected - actual

       {
      -  "error": "Length of account_number should be between 7 and 11 when bank_country_code is 'US'"
      +  "error": "Length of account_number should be between 8 and 20 when bank_country_code is 'CN'"
       }

