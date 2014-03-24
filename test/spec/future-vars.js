describe( 'When calling get', function() {

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

  describe( 'and passing options', function() {

    var valName, spy, options;

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
      expect( spy ).to.have.been.calledWithExactly( options );
    });

  });

});

describe( 'Executing reset', function() {

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

describe( 'When calling isPublished', function() {

  var val;

  describe( 'and the variable has not been published', function() {

    beforeEach(function() {
      val = futureVars.isPublished( 'someVal' );
    });

    it( 'should return false', function() {
      expect( val ).to.be.false;
    });

  });

  describe( 'and the variable has been published', function() {

    beforeEach(function() {
      futureVars.publish( 'someVal', 'lalala' );
      val = futureVars.isPublished( 'someVal' );
    });

    it( 'should return true', function() {
      expect( val ).to.be.true;
    });

  });

});

describe( 'When calling promised', function() {

  var promisedVar;

  describe( 'and the variable has yet to be published', function() {

    beforeEach(function() {

      promisedVar = futureVars.promised( 'someVal' );

    });

    it( 'should return a promise', function() {
      expect( promisedVar ).to.be.instanceof( Promise );
    });

  });

  describe( 'and the variable has been published', function() {

    beforeEach(function() {

      futureVars.publish( 'someVal', 'pasta' );
      promisedVar = futureVars.promised( 'someVal' );

    });

    it( 'should also return a promise', function() {
      expect( promisedVar ).to.be.instanceof( Promise );
    });

  });

  describe( 'with an array of values', function() {

    beforeEach(function() {

      promisedVar = futureVars.promised( ['someVal', 'someOtherVal'] );

    });

    it( 'should return a promise', function() {
      expect( promisedVar ).to.be.instanceof( Promise );
    });

  });

});

describe( 'When publishing', function() {

  var promises;

  describe( 'a single variable', function() {

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

  describe( 'multiple values', function() {

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

  describe( 'and passing options', function() {

    var spy, options;

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

});