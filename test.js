var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var url = 'http://preview.airwallex.com:30001';
chai.use(chaiHttp);

var const_paylod_AU = {
	 payment_method: 'SWIFT',
	 account_name: 'John Smith',
	 account_number: '123456',
	 bank_country_code: 'AU',
	 swift_code: 'ICBCAUBJ',
	 aba: '11122233A',
	 bsb: 'A123DF'	 
};

var const_paylod_US = {
	 payment_method: 'SWIFT',
	 account_name: 'John Smith',
	 account_number: '123',
	 bank_country_code: 'US',
	 swift_code: 'ICBCUSBJ',
	 aba: '11122233A'
};

var const_paylod_CN = {
	 payment_method: 'SWIFT',
	 account_name: 'John Smith',
	 account_number: '12345678',
	 bank_country_code: 'CN',
	 swift_code: 'ICBCCNBJ',
	 aba: '11122233A'
};

function modified_payload(payment_method,account_name,account_number,country, swift_code, aba, bsb){
	 //console.log(country);
	 //console.log(swift_code);
	
	 const_paylod_AU.payment_method=payment_method;
	 const_paylod_AU.account_name=account_name;
	 const_paylod_AU.account_number=account_number;
	 const_paylod_AU.bank_country_code=country ;
	 const_paylod_AU.swift_code=swift_code;
	 const_paylod_AU.aba=aba;
	 const_paylod_AU.bsb=bsb;
	 
	 return const_paylod_AU
}

describe('Testing Bank API ', function() {
var test_valid_response = [
      {args: const_paylod_AU , desc: [ 'Country AU'],    expected: {'success':'Bank details saved'}},
      {args: const_paylod_US , desc: [ 'Country US'],    expected: {'success':'Bank details saved'}},
	  {args: const_paylod_CN , desc: [ 'Country CN'],    expected: {'success':'Bank details saved'}}
  ];
  
var test_failed_response = [
      { case_num: 0, desc: ['bank_country_code'],    	    expected: {'error': '\'bank_country_code\' is required, and should be one of \'US\', \'AU\', or \'CN\''}},
      { case_num: 1, desc: ['payment_method'],      	    expected: {'error': '\'payment_method\' field required, the value should be either \'LOCAL\' or \'SWIFT\''}},
      { case_num: 2, desc: ['swift_code'],          	    expected: {'error': '\'swift_code\' is required when payment method is \'SWIFT\''}},
	  { case_num: 3, desc: ['account_number'],      	    expected: {'error': '\'account_number\' is required'}},
	  { case_num: 4, desc: ['account_name'],        		expected: {'error': '\'account_name\' is required'}},
	  { case_num: 5, desc: ['swiftcode_length_US'], 		expected: {'error': 'Length of \'swift_code\' should be either 8 or 11'}},
	  { case_num: 6, desc: ['account_name'],         		expected: {'error': 'Length of account_name should be between 2 and 10'}},
	  { case_num: 7, desc: ['account_number_length_US'],    expected: {'error': 'Length of account_number should be between 7 and 11 when bank_country_code is \'US\'' }},
	  { case_num: 8, desc: ['account_number_length_AU'],    expected: {'error': 'Length of account_number should be between 6 and 9 when bank_country_code is \'AU\'' }},
	  { case_num: 9, desc: ['account_number_length_CN'],    expected: {'error': 'Length of account_number should be between 8 and 20 when bank_country_code is \'CN\'' }},
	  { case_num: 10, desc: ['swiftcode_invalid_US'], 		expected: {'error': 'The swift code is not valid for the given bank country code: US'}},
	  { case_num: 11, desc: ['swiftcode_invalid_CN'], 		expected: {'error': 'The swift code is not valid for the given bank country code: CN'}},
	  { case_num: 12, desc: ['swiftcode_invalid_AU'], 		expected: {'error': 'The swift code is not valid for the given bank country code: AU'}},
	  { case_num: 13, desc: ['bsb_mandatory_AU'], 		    expected: {'error': '\'bsb\' is required when bank country code is \'AU\''}},
	  { case_num: 14, desc: ['aba_mandatory_US'], 		    expected: {'error': '\'aba\' is required when bank country code is \'US\''}},
  ];
  
  test_valid_response.forEach(function(test_valid_response) {
    it('With correct deatils for  : '+ test_valid_response.desc + ' success response is returned', function(done) {
       console.log("Test payload is :: ");
	   console.log(test_valid_response.args);		
       chai.request(url)
           .post('/bank')
           .send(test_valid_response.args)
	  .end(function(err, res){
	  console.log(res.body);
      res.should.have.status(200);
      res.should.be.json;
	  res.should.have.headers;
      res.body.should.be.eql(test_valid_response.expected);
      done();
    });
  });
});
  test_failed_response.forEach(function(test_failed_response) {
    it('With missing: '+ test_failed_response.desc + ' failed response is returned', function(done) {
       switch (test_failed_response.case_num){
		   case 0:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '123','', 'ICBCUSBJ','11122233A','']);
		   break;
		   
		   case 1:
		   var sample = modified_payload.apply(null,['','John Smith', '123','US', 'ICBCUSBJ','11122233A','']);
		   break;
		   
		   case 2:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '123','US', '','11122233A','']); 
		   break;

           case 3:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '','US', '','11122233A','']); 
		   break;

		   case 4:
		   var sample = modified_payload.apply(null,['SWIFT','', '123','US', '','11122233A','']); 
		   break;
           
           case 5:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '123','US', 'ICBCUSB','11122233A','']); 
		   break; 

           case 6:
		   var sample = modified_payload.apply(null,['SWIFT','J', '123','US', 'ICBCUSB','11122233A','']); 
		   break;
		   
           case 7:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '1234567890ABCDEFGH','US', 'ICBCUSB','11122233A','']); 
		   break; 
           //failing
		   case 8:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '123456789A','AU', 'ICBCAUBJ','11122233A','123ADF']); 
		   break;
           //failing 
           case 9:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '1234567890ABCDEFGHIJKL','CN', 'ICBCCNBJ','11122233A','']); 
		   break;

		   case 10:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '12345678','US', 'ICBKCNBJ','11122233A','']); 
		   break;

		   case 11:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '12345678','CN', 'ICBKDDBJ','11122233A','']); 
		   break;
           
           case 12:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '12345678','AU', 'ICBKDDBJ','11122233A','123ADF']); 
		   break;

		   case 13:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '12345678','AU', 'ICBKAUBJ','11122233A','']); 
		   break;	
           
           case 14:
		   var sample = modified_payload.apply(null,['SWIFT','John Smith', '12345678','US', 'ICBKUSBJ','','']); 
		   break;		   
	   }
	 
       console.log("Test payload is :: ");	   
	   console.log(sample);		
       chai.request(url)
           .post('/bank')
           .send(sample)
	  .end(function(err, res){
	  console.log(res.body);
      res.should.have.status(400);
      res.should.be.json;
	  res.should.have.headers;
      res.body.should.be.eql(test_failed_response.expected);
      done();
    });
  });
 });
});