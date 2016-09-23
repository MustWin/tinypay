var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("DomainMicropay error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("DomainMicropay error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("DomainMicropay contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of DomainMicropay: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to DomainMicropay.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: DomainMicropay not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "domain",
            "type": "string"
          }
        ],
        "name": "getPaymentContractForDomain",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "clientDomain",
            "type": "string"
          },
          {
            "name": "clientAddr",
            "type": "address"
          },
          {
            "name": "pricePerHit",
            "type": "uint256"
          }
        ],
        "name": "confirmClient",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "domain",
            "type": "string"
          },
          {
            "name": "_pricePerHit",
            "type": "uint256"
          }
        ],
        "name": "signUp",
        "outputs": [],
        "type": "function"
      },
      {
        "inputs": [],
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "domain",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "client",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_pricePerHit",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "confirmationHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "contractAddr",
            "type": "address"
          }
        ],
        "name": "ClientCreated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "domain",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "client",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "clientContract",
            "type": "address"
          }
        ],
        "name": "ClientConfirmed",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x606060405260018054600160a060020a0319163317905561095b806100246000396000f3606060405260e060020a6000350463120ef849811461003c5780632e1a7d4d146100ea57806334b18f7f1461010d57806369075afe1461017f575b005b6102156004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050505050505060006000600060005083604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005090508060010160149054906101000a900460ff16151561024657610002565b61003a600435600154600160a060020a0390811633919091161461025957610002565b6102326004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496505093359350506044359150506001546000908190600160a060020a039081163391909116146102a057610002565b61003a6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050933593505050506040805160e081018252600060c08201818152825260208201819052918101829052606081018290526080810182905260a081018290528351829190600490101561043557610002565b60408051600160a060020a03929092168252519081900360200190f35b604080519115158252519081900360200190f35b60040154600160a060020a031692915050565b8030600160a060020a031631101561027057610002565b604051600154600160a060020a031690600090839082818181858883f19350505050151561029d57610002565b50565b600060005085604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005090508060010160149054906101000a900460ff1615801561031157506001810154600160a060020a038581169116145b80156103205750600281015483145b1561041f576001818101805474ff0000000000000000000000000000000000000000191660a060020a1790819055604080516004850154600160a060020a0393841660208301819052931691810182905260608082528554600295811615610100026000190116949094049381018490527fa4f76c25475b2ddc28917eede2b7302dab03d65b7e83c8dc905e31b8c6ecfac2938593929190819060808201908690801561040e5780601f106103e35761010080835404028352916020019161040e565b820191906000526020600020905b8154815290600101906020018083116103f157829003601f168201915b505094505050505060405180910390a15b6001015460a060020a900460ff16949350505050565b600060005085604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000509250826000016000508054600181600116156101000203166002900490506000141580156104af5750600183015460a060020a900460ff165b156104b957610002565b4340915060c0604051908101604052808681526020013381526020016000815260200185815260200183815260200130600160009054906101000a9004600160a060020a031633886040516101d08061078b8339018085600160a060020a0316815260200184600160a060020a0316815260200183600160a060020a03168152602001828152602001945050505050604051809103906000f0815260200150905080600060005086604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000506000820151816000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061060957805160ff19168380011785555b506106399291505b8082111561078757600081556001016105f5565b828001600101855582156105ed579182015b828111156105ed57825182600050559160200191906001019061061b565b505060208281015160018301805460408681015173ffffffffffffffffffffffffffffffffffffffff1992831690941774ff0000000000000000000000000000000000000000191660a060020a9490940293909317909155606085810151600286015560808681015160038781019190915560a0978801516004978801805490951617909355835188880151600160a060020a0333818116848a01529683018e90529382018b9052928316918101919091528681528b51968101969096528a517f80f3be33e217f9fcaf63f9cecfc6469f76a03e66c104fc71df12278c3db50b52968c9694958c958b959293849360c08501938b8101938392869284928792600092601f86010402600f01f150905090810190601f16801561076f5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15050505050565b50905660606040526040516080806101d0833960e06040529051905160a05160c05160008054600160a060020a031990811684179091556001805482168517905560038290556002805490911685179055505050506101718061005f6000396000f3606060405260e060020a600035046303e00f4381146100315780632e1a7d4d1461003a578063fff89feb1461007e575b005b61009060035481565b61002f600435600154600090819033600160a060020a039081169116148015906100745750600054600160a060020a039081163390911614155b156100a757610002565b61002f60035434101561014557610002565b60408051918252519081900360200190f35b505050565b60648360630204915060648304905030600160a060020a03163181830111156100cf57610002565b670de0b6b3a76400008310156100e457610002565b600254604051600160a060020a039190911690600090839082818181858883f19350505050151561011457610002565b60008054604051600160a060020a03919091169190849082818181858883f1935050505015156100a257610002565b565b600354604051600160a060020a0330169160009182818181858883f1935050505015156101435761000256",
    "events": {
      "0x80f3be33e217f9fcaf63f9cecfc6469f76a03e66c104fc71df12278c3db50b52": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "domain",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "client",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_pricePerHit",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "confirmationHash",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "contractAddr",
            "type": "address"
          }
        ],
        "name": "ClientCreated",
        "type": "event"
      },
      "0xa4f76c25475b2ddc28917eede2b7302dab03d65b7e83c8dc905e31b8c6ecfac2": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "domain",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "client",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "clientContract",
            "type": "address"
          }
        ],
        "name": "ClientConfirmed",
        "type": "event"
      }
    },
    "updated_at": 1474593045991,
    "links": {},
    "address": "0x042f7486c6e9e35bc151ae24b77d57bff34c3dfa"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "DomainMicropay";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.DomainMicropay = Contract;
  }
})();
