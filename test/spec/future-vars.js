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

describe('Setting `then` callbacks on a FutureVariable', function() {

  var cbOneSpy, cbTwoSpy, publishSpy, val;

  beforeEach(function() {

    val = 'pasta';
    cbOneSpy = sinon.spy();
    cbTwoSpy = sinon.spy();
    publishSpy = sinon.spy( futureVars, 'publish' );

    futureVars.promised( 'someVal' ).then( cbOneSpy );
    futureVars.publish( 'someVal', val );
    futureVars.promised( 'someVal' ).then( cbTwoSpy );

  });

  afterEach(function() {
    futureVars.reset();
    publishSpy.restore();
  });

  it( 'should execute the first cb after the value is published', function() {
    expect( cbOneSpy ).to.have.been.calledOnce;
    expect( publishSpy ).to.have.been.calledOnce;
    expect( publishSpy ).to.have.been.calledBefore( cbOneSpy );
  });

  it( 'should pass the value to the callbacks', function() {
    expect( cbOneSpy ).to.always.have.been.calledWithExactly( val );
    expect( cbTwoSpy ).to.always.have.been.calledWithExactly( val );
  });

  it( 'should run callbacks immediately if the value is published', function() {
    expect( cbTwoSpy ).to.have.been.calledOnce;
    expect( publishSpy ).to.have.been.calledBefore( cbTwoSpy );
  });

});