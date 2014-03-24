describe('When calling get', function() {

  var unsetVal, setVal, val;

  beforeEach(function() {

    val = 'pasta';
    futureVars.publish( 'setVal', val );
    unsetVal = futureVars.get( 'unsetVal' );
    setVal   = futureVars.get( 'setVal' );

  });

  afterEach(function() {
    futureVars.reset();
  });

  it( 'should return undefined for unpublished values', function() {
    expect( unsetVal ).to.be.undefined;
  });

  it( 'should return the correct value for published values', function() {
    expect( setVal ).to.equal( val );
  });

});

describe('When calling get, and passing options', function() {

  var valName, val, spy, options;

  beforeEach(function() {

    valName = 'val';
    spy = sinon.spy();
    options = {
      name: 'bill',
      age: 45,
      hungry: true
    };
    futureVars.publish( valName, spy);
    val = futureVars.get( valName, options, true, 'string' );

  });

  afterEach(function() {
    futureVars.reset();
  });

  it( 'should pass the options to the reqres handler', function() {
    expect( spy ).to.have.been.calledWithExactly( options, true, 'string' );
  });

});

describe('Executing reset', function() {

  var unsetVal, val;

  beforeEach(function() {

    val = 'pasta';
    futureVars.publish( 'setVal', val );
    futureVars.reset();
    unsetVal = futureVars.get( 'setVal' );

  });

  afterEach(function() {
    futureVars.reset();
  });

  it( 'should reset all published values', function() {
    expect( unsetVal ).to.be.undefined;
  });

});

describe('When calling promised', function() {

  var promisedVar;

  beforeEach(function() {

    promisedVar = futureVars.promised( 'someVal' );

  });

  it( 'should return a promise', function() {
    expect( promisedVar ).to.be.instanceof( Promise );
  });

});

describe('When calling promised with an array of values', function() {

  var promisedVar;

  beforeEach(function() {

    promisedVar = futureVars.promised( ['someVal', 'someOtherVal'] );

  });

  it( 'should return a promise', function() {
    expect( promisedVar ).to.be.instanceof( Promise );
  });

});

describe('When publishing a value', function() {

  var promises;

  beforeEach(function() {

    promises = Promise.all([
      futureVars.promised( 'someVal' ),
      futureVars.promised( 'someVal' ),
      futureVars.promised( 'someVal' )
    ]);

    futureVars.publish( 'someVal', 'pasta' );

  });

  afterEach(function() {
    futureVars.reset();
  });

  it( 'should resolve all of the promises', function() {
    return expect( promises ).to.have.eventually.been.fulfilled;
  });

});

describe('When publishing multiple values', function() {

  var promises;

  beforeEach(function() {

    promises = futureVars.promised( ['valOne','valTwo','valThree'] );

    futureVars.publish( 'valOne', 'pasta' );
    futureVars.publish( 'valTwo', 'sandwich' );
    futureVars.publish( 'valThree', 'cookies' );

  });

  afterEach(function() {
    futureVars.reset();
  });

  it( 'should resolve the promise', function() {
    return expect( promises ).to.have.eventually.been.fulfilled;
  });

});

describe('When requesting a value with options', function() {

  var promises, spy, options;

  beforeEach(function() {

    options = {
      color: 'red',
      name: 'Jason',
      hungry: true
    };

    spy = sinon.spy();

    promises = futureVars.promised( 'someVal', options );
    futureVars.publish( 'someVal', spy );

  });

  afterEach(function() {
    futureVars.reset();
  });

  it( 'should pass the options onto the reqres handler', function() {
    return expect( spy ).to.have.been.calledWithExactly( options );
  });

});