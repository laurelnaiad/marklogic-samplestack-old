# mlData

* will end up being replaced by Angular 2.0 altogether... this is just following the pattern in a very limited way, without doing any extra work

[Angular 2.0 design doc](https://docs.google.com/document/d/1DMacL7iwjSMPP0ytZfugpU4v0PWUK0BT6lhyaVEmlBQ/edit#heading=h.adsv85z7smgj)


## mlModel (nee $resource, but higher level)

The Model class acts as an extensible abstraction layer on top of low-level storage and network utilities to manage fetching , caching, and querying data. Behind the scenes, Model will create private caches of fetched data + buffers in mlStore (as live app state), ~allowing querying, paging, and updating of models locally without necessarily requiring network access~ (we seriously don't have time for this now).

 an extensible abstraction layer on top of low-level storage and network utilities to manage fetching , caching, and querying data. Behind the scenes, Model will create private caches of fetched data + buffers in ngStore, allowing querying, paging, and updating of models locally without necessarily requiring network access.

will provide a limited set of operations on data (this feature set makes our mlHttpAdapter pretty simple). E.g.:

* limit()
* skip()
* find(query)
* findById()
* count()
* order()

Other notes:

* Properties of Model instances can be bound to inside views.
* Updating properties of Model instances should be managed through mutator methods.
* Model is class, which can be instantiated directly or extended to define custom behavior. E.g. class Issue extends Model {}
* optionally a buffer of additional data to be viewed in time.
*  Model assumes that implicit model changes are one-way (reading), leaving the application responsible for explicitly writing data changes. In other words, local changes to models within views wouldn’t be implicitly written back to the server.
*  This solution should reduce the size of the first request for data, then request additional data (as configured), drastically increasing the speed at which additional data is displayed when asked for by views (like ng-repeat, infinite scrolling directives, etc).... The developer extends the Model class to fetch and cache all the contacts. The Model class could:
Err on the side of initial page load time, and could load only 10 contacts to show the initial view and be done with it until the user scrolls, at which point the model requests more contacts.
Err on the side of data update speed, and load all 1000 contacts from the server into memory, even though the user is only viewing 10 right now.
Make an initial request for only the required 10 contacts, and make a subsequent request to load the next 20 and previous 20 contacts.
The “C” approach is what will be most supported and encouraged throughout the design of Angular 2.0 data persistence, particularly in the higher levels of abstraction like ngData. The ngData module should provide some basic configuration to control the aggressiveness of pre-fetching for different models. **stretch goal**

*"By default, Model instances keep state synced to ngStore, but can accept an implementation of IAdapter to easily support synchronization/replication with network-based persistence (although IAdapter doesn’t necessarily need to persist to a network location)."*

We just wire mlModel to mlHttpAdapter without all of the genericization of Angular 2.0

### MarkLogic specifics

We will use an enhanced jsonschema implementation as an additional feature of our model for validation and comprehension of models and instances

## mlChangeEvent

This type will be used to broadcast changes to models to other parts of the app, in order to allow customization of how data changes are handled. This will also be used internally within the ngData model to provide metadata of a change to an underlying Adapter, in order for the Adapter to make more complex decisions about how to handle data. Ideally, the ChangeEvent should contain a series of changes to be applied to data, a copy of the data in its original state before the changes were applied, and some hint to the source of the event.

### MarkLogic specifics

We will bind change events to the other parts of the app that want to track them.  In particular, to portions of views that should visually indicate to the user that change is under way, and to controllers which much know such things as the managers of app state.

## mlHttpAdapter

*The IAdapter interface specifies the methods that should be implemented by a participating Adapter in order to make synchronizing Models with a server Just Work. **When instances of Model are created, they should be constructed with an implementation of IAdapter, unless the Model is never meant to be persisted to a server.** *

*The IAdapter interface may allow adapters to provide more efficient and sophisticated means of synchronizing data, such as supporting **patching**.*

*IAdapter Example
class FirebaseAdapter implements IAdapter {...}
var fooAdapter = new FirebaseAdapter(‘http://foo’);
var myModel = new Model({adapter: fooAdapter});*

*Http Considerations
The ngHttp module will implement measures to ensure safe **cross-site scripting** similar to Angular 1, including but not limited to:
** ~JSONP support~ (not now) **,
**Receiving XSRF tokens, and passing to origin server as header or cookies**.*

*For higher-level abstractions, such as ngData, it is the framework’s responsibility to intelligently manage the amount of cached data in storage and in memory. How this will actually be implemented is TBD, but it will likely be a process of configurable, auto-expiring data (collections or objects that haven’t been interacted with in a while), with a garbage collection process that runs periodically as an app is being used.* ** this will be pretty much out of scope for us -- at best we may put the API in place with a default implementation that handles none of this and errs on the side of dumping and re-fetching data so as not to push memory constraints and to have "fresher" data. **

### MarkLogic specifics

Essentially, mlHttpAdapter will be a thin layer on top of $http, $resource or Restangular that is customized to deal with MarkLogic-specific conditions, expecting middle tier servers not to obscure MarkLogic-specific protocols such as patch and the http status codes that MarkLogic restapis typically produce.

## mlStore

*The $httpBackend would expose the following properties and methods:
pendingRequests - a PendingRequestsCollection.  This collection holds all the requests that have been made and not yet resolved.
The PendingRequestsCollection has the following properties and methods:
count - the number of requests that have not yet been resolved.
get(requestProps) - returns the first PendingRequest that matches the passed parameter. If there is  E.g. $httpBackend.pendingRequests.get({url:’/some/url’, method:’POST’});
all(requestProps) - returns all the requests that match the passed parameter.

PendingRequest objects have the following properties and methods:
respondWith(data, headers, status) - a helper method that will synchronously resolve the response.
config - the original config of the request
response - the deferred object that can be resolved with the response to the request.*

It should be noted that although that quote appears in a separate document from the Angular 2.0 http design doc, the $httpBackend is also implemented in regular angular, not just in the mock module. As such, this direction, if taken, applies in its own little way to our mlHttpAdapter implementation -- essentially, that it should know about its pending requests. It is expected that our adapter will implement the pending requests pool as a set of mlChangeEvents, and that this collection will be the basis for comprehension of what is in progress/pending at any point in time. All changes to this collection will happen "in concert" with events on a scope that is branched **off** of the rootscope -- which is to say that this scope will be **off** of the scope that the active UI elements are bound. This is a performance thing.

rootScope
-dataScope (a hidden element, kind of a shadow dom-ish thing)
-uiScope (the actual UI)

mlData Store is a controller in Angular 1.0 terms, and manages the mlStore.

## Test Strategy

We'll limit the scope of testing these generic components in favor of testing the implementations that are Samplestack-specific.  We will fill in gaps where the Samplestack components do not exercise portions of the generic components, but such cases should be minimal, as we will seek to implement only those portions of the generic that are actually useful for Samplestack.

We'll use a sinon-based http mock to test these components where that mock simulates what a non-obstructing MarkLogic middle tier would do.
