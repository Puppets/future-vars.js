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