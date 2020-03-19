(function(jQuery){
	if(jQuery && !jQuery.whenAll){
		jQuery.whenAll = function(whennables){
			var defer = jQuery.Deferred();
			if(whennables && whennables.length > 1){
				var whennable = whennables.shift();
				jQuery.when(whennable, jQuery.whenAll(whennables))
					.done(function(first, rest){
						rest.unshift(first);
						defer.resolve(rest);
					}).fail(function(e){
						defer.reject(e);
					});
			} else if(whennables) {
				jQuery.when(whennables[0])
					.done(function(response){
						defer.resolve([response]);
					}).fail(function(e){
						defer.reject(e);
					});
			} else {
				defer.resolve(whennables)
			}
			return defer.promise();
		}
	}

	// jquery when to javascript Promise
	if(jQuery && !jQuery.whenPromise && window.Promise){
		jQuery.whenPromise = function(whennable){
			return new Promise(function(resolve, reject){
				$.when(whennable).done(resolve).fail(reject);
			});
		}
	}

	// Javascript Promise to jquery when
	if(jQuery && !jQuery.promiseWhen && window.Promise){
		jQuery.promiseWhen = function(whennable){
			var defer = jQuery.Deferred();
			if(whennable){
				whennable.then(defer.resolve).catch(defer.reject);
			} else {
				defer.resolve();
			}
			return defer.promise();
		}
	}

	// jquery whenAll promise implementation
	if(jQuery && !jQuery.promiseWhenAll && window.Promise){
		jQuery.promiseWhenAll = function(whennables){
			var defer = jQuery.Deferred();
			if(whennables){
				var promiseables = whennables.map(jQuery.whenPromise);
				Promise.all(promiseables).then(defer.resolve).catch(defer.reject);
			} else {
				defer.resolve(whennables);
			}
			return defer.promise();
		}
	}
})(window.$)
