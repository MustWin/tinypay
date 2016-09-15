// This file is an automatically generated Go binding. Do not modify as any
// change will likely be lost upon the next re-generation!

package oracles

import (
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// DomainMicropayABI is the input ABI used to generate the binding from.
const DomainMicropayABI = `[{"constant":false,"inputs":[{"name":"domain","type":"string"}],"name":"getPaymentContractForDomain","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"clientDomain","type":"string"},{"name":"clientAddr","type":"address"},{"name":"pricePerHit","type":"uint256"}],"name":"confirmClient","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"string"},{"name":"_pricePerHit","type":"uint256"}],"name":"signUp","outputs":[],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"domain","type":"string"},{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"_pricePerHit","type":"uint256"},{"indexed":false,"name":"confirmationHash","type":"bytes32"},{"indexed":false,"name":"contractAddr","type":"address"}],"name":"ClientCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"domain","type":"string"},{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"clientContract","type":"address"}],"name":"ClientConfirmed","type":"event"}]`

// DomainMicropayBin is the compiled bytecode used for deploying new contracts.
const DomainMicropayBin = `606060405260018054600160a060020a031916331790556109a2806100246000396000f3606060405260e060020a6000350463120ef849811461003f5780632e1a7d4d146100f257806334b18f7f1461011a57806369075afe14610191575b610002565b346100025761022c6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050505050505060006000600060005083604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005090508060010160149054906101000a900460ff16151561025f57610002565b3461000257610249600435600154600160a060020a0390811633919091161461027257610002565b346100025761024b6004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437509496505093359350506044359150506001546000908190600160a060020a039081163391909116146102be57610002565b34610002576102496004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284375094965050933593505050506040805160e081018252600060c08201818152825260208201819052918101829052606081018290526080810182905260a081018290528351829190600490101561045357610002565b60408051600160a060020a03929092168252519081900360200190f35b005b604080519115158252519081900360200190f35b60040154600160a060020a031692915050565b8030600160a060020a031631101561028957610002565b604051600154600160a060020a0316906108fc8315029083906000818181858888f1935050505015156102bb57610002565b50565b600060005085604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050908152602001604051809103902060005090508060010160149054906101000a900460ff1615801561032f57506001810154600160a060020a038581169116145b801561033e5750600281015483145b1561043d576001818101805474ff0000000000000000000000000000000000000000191660a060020a1790819055604080516004850154600160a060020a0393841660208301819052931691810182905260608082528554600295811615610100026000190116949094049381018490527fa4f76c25475b2ddc28917eede2b7302dab03d65b7e83c8dc905e31b8c6ecfac2938593929190819060808201908690801561042c5780601f106104015761010080835404028352916020019161042c565b820191906000526020600020905b81548152906001019060200180831161040f57829003601f168201915b505094505050505060405180910390a15b6001015460a060020a900460ff16949350505050565b600060005085604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000509250826000016000508054600181600116156101000203166002900490506000141580156104cd5750600183015460a060020a900460ff165b156104d757610002565b4340915060c0604051908101604052808681526020013381526020016000815260200185815260200183815260200130600160009054906101000a9004600160a060020a031633886040516101f3806107af8339018085600160a060020a0316815260200184600160a060020a0316815260200183600160a060020a03168152602001828152602001945050505050604051809103906000f0801561000257815260200150905080600060005086604051808280519060200190808383829060006004602084601f0104600302600f01f15090500191505090815260200160405180910390206000506000820151816000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061062d57805160ff19168380011785555b5061065d9291505b808211156107ab5760008155600101610619565b82800160010185558215610611579182015b8281111561061157825182600050559160200191906001019061063f565b505060208281015160018301805460408681015173ffffffffffffffffffffffffffffffffffffffff1992831690941774ff0000000000000000000000000000000000000000191660a060020a9490940293909317909155606085810151600286015560808681015160038781019190915560a0978801516004978801805490951617909355835188880151600160a060020a0333818116848a01529683018e90529382018b9052928316918101919091528681528b51968101969096528a517f80f3be33e217f9fcaf63f9cecfc6469f76a03e66c104fc71df12278c3db50b52968c9694958c958b959293849360c08501938b8101938392869284928792600092601f86010402600f01f150905090810190601f1680156107935780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a15050505050565b50905660606040526040516080806101f3833960e06040529051905160a05160c05160008054600160a060020a031990811684179091556001805482168517905560038290556002805490911685179055505050506101948061005f6000396000f3606060405260e060020a600035046303e00f4381146100345780632e1a7d4d14610042578063fff89feb1461008b575b610002565b34610002576100a260035481565b34610002576100b4600435600154600090819033600160a060020a039081169116148015906100815750600054600160a060020a039081163390911614155b156100bb57610002565b34610002576100b460035434101561016357610002565b60408051918252519081900360200190f35b005b505050565b60646063840204915060648304905030600160a060020a03163181830111156100e357610002565b670de0b6b3a76400008310156100f857610002565b600254604051600160a060020a03919091169082156108fc029083906000818181858888f19350505050151561012d57610002565b60008054604051600160a060020a03919091169184156108fc02918591818181858888f1935050505015156100b657610002565b565b600354604051600160a060020a0330169180156108fc02916000818181858888f1935050505015156101615761000256`

// DeployDomainMicropay deploys a new Ethereum contract, binding an instance of DomainMicropay to it.
func DeployDomainMicropay(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *DomainMicropay, error) {
	parsed, err := abi.JSON(strings.NewReader(DomainMicropayABI))
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	address, tx, contract, err := bind.DeployContract(auth, parsed, common.FromHex(DomainMicropayBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &DomainMicropay{DomainMicropayCaller: DomainMicropayCaller{contract: contract}, DomainMicropayTransactor: DomainMicropayTransactor{contract: contract}}, nil
}

// DomainMicropay is an auto generated Go binding around an Ethereum contract.
type DomainMicropay struct {
	DomainMicropayCaller     // Read-only binding to the contract
	DomainMicropayTransactor // Write-only binding to the contract
}

// DomainMicropayCaller is an auto generated read-only Go binding around an Ethereum contract.
type DomainMicropayCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DomainMicropayTransactor is an auto generated write-only Go binding around an Ethereum contract.
type DomainMicropayTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DomainMicropaySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type DomainMicropaySession struct {
	Contract     *DomainMicropay   // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// DomainMicropayCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type DomainMicropayCallerSession struct {
	Contract *DomainMicropayCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts         // Call options to use throughout this session
}

// DomainMicropayTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type DomainMicropayTransactorSession struct {
	Contract     *DomainMicropayTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts         // Transaction auth options to use throughout this session
}

// DomainMicropayRaw is an auto generated low-level Go binding around an Ethereum contract.
type DomainMicropayRaw struct {
	Contract *DomainMicropay // Generic contract binding to access the raw methods on
}

// DomainMicropayCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type DomainMicropayCallerRaw struct {
	Contract *DomainMicropayCaller // Generic read-only contract binding to access the raw methods on
}

// DomainMicropayTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type DomainMicropayTransactorRaw struct {
	Contract *DomainMicropayTransactor // Generic write-only contract binding to access the raw methods on
}

// NewDomainMicropay creates a new instance of DomainMicropay, bound to a specific deployed contract.
func NewDomainMicropay(address common.Address, backend bind.ContractBackend) (*DomainMicropay, error) {
	contract, err := bindDomainMicropay(address, backend.(bind.ContractCaller), backend.(bind.ContractTransactor))
	if err != nil {
		return nil, err
	}
	return &DomainMicropay{DomainMicropayCaller: DomainMicropayCaller{contract: contract}, DomainMicropayTransactor: DomainMicropayTransactor{contract: contract}}, nil
}

// NewDomainMicropayCaller creates a new read-only instance of DomainMicropay, bound to a specific deployed contract.
func NewDomainMicropayCaller(address common.Address, caller bind.ContractCaller) (*DomainMicropayCaller, error) {
	contract, err := bindDomainMicropay(address, caller, nil)
	if err != nil {
		return nil, err
	}
	return &DomainMicropayCaller{contract: contract}, nil
}

// NewDomainMicropayTransactor creates a new write-only instance of DomainMicropay, bound to a specific deployed contract.
func NewDomainMicropayTransactor(address common.Address, transactor bind.ContractTransactor) (*DomainMicropayTransactor, error) {
	contract, err := bindDomainMicropay(address, nil, transactor)
	if err != nil {
		return nil, err
	}
	return &DomainMicropayTransactor{contract: contract}, nil
}

// bindDomainMicropay binds a generic wrapper to an already deployed contract.
func bindDomainMicropay(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(DomainMicropayABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_DomainMicropay *DomainMicropayRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _DomainMicropay.Contract.DomainMicropayCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_DomainMicropay *DomainMicropayRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DomainMicropay.Contract.DomainMicropayTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_DomainMicropay *DomainMicropayRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _DomainMicropay.Contract.DomainMicropayTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_DomainMicropay *DomainMicropayCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _DomainMicropay.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_DomainMicropay *DomainMicropayTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _DomainMicropay.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_DomainMicropay *DomainMicropayTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _DomainMicropay.Contract.contract.Transact(opts, method, params...)
}

// ConfirmClient is a paid mutator transaction binding the contract method 0x34b18f7f.
//
// Solidity: function confirmClient(clientDomain string, clientAddr address, pricePerHit uint256) returns(bool)
func (_DomainMicropay *DomainMicropayTransactor) ConfirmClient(opts *bind.TransactOpts, clientDomain string, clientAddr common.Address, pricePerHit *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.contract.Transact(opts, "confirmClient", clientDomain, clientAddr, pricePerHit)
}

// ConfirmClient is a paid mutator transaction binding the contract method 0x34b18f7f.
//
// Solidity: function confirmClient(clientDomain string, clientAddr address, pricePerHit uint256) returns(bool)
func (_DomainMicropay *DomainMicropaySession) ConfirmClient(clientDomain string, clientAddr common.Address, pricePerHit *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.Contract.ConfirmClient(&_DomainMicropay.TransactOpts, clientDomain, clientAddr, pricePerHit)
}

// ConfirmClient is a paid mutator transaction binding the contract method 0x34b18f7f.
//
// Solidity: function confirmClient(clientDomain string, clientAddr address, pricePerHit uint256) returns(bool)
func (_DomainMicropay *DomainMicropayTransactorSession) ConfirmClient(clientDomain string, clientAddr common.Address, pricePerHit *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.Contract.ConfirmClient(&_DomainMicropay.TransactOpts, clientDomain, clientAddr, pricePerHit)
}

// GetPaymentContractForDomain is a paid mutator transaction binding the contract method 0x120ef849.
//
// Solidity: function getPaymentContractForDomain(domain string) returns(address)
func (_DomainMicropay *DomainMicropayTransactor) GetPaymentContractForDomain(opts *bind.TransactOpts, domain string) (*types.Transaction, error) {
	return _DomainMicropay.contract.Transact(opts, "getPaymentContractForDomain", domain)
}

// GetPaymentContractForDomain is a paid mutator transaction binding the contract method 0x120ef849.
//
// Solidity: function getPaymentContractForDomain(domain string) returns(address)
func (_DomainMicropay *DomainMicropaySession) GetPaymentContractForDomain(domain string) (*types.Transaction, error) {
	return _DomainMicropay.Contract.GetPaymentContractForDomain(&_DomainMicropay.TransactOpts, domain)
}

// GetPaymentContractForDomain is a paid mutator transaction binding the contract method 0x120ef849.
//
// Solidity: function getPaymentContractForDomain(domain string) returns(address)
func (_DomainMicropay *DomainMicropayTransactorSession) GetPaymentContractForDomain(domain string) (*types.Transaction, error) {
	return _DomainMicropay.Contract.GetPaymentContractForDomain(&_DomainMicropay.TransactOpts, domain)
}

// SignUp is a paid mutator transaction binding the contract method 0x69075afe.
//
// Solidity: function signUp(domain string, _pricePerHit uint256) returns()
func (_DomainMicropay *DomainMicropayTransactor) SignUp(opts *bind.TransactOpts, domain string, _pricePerHit *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.contract.Transact(opts, "signUp", domain, _pricePerHit)
}

// SignUp is a paid mutator transaction binding the contract method 0x69075afe.
//
// Solidity: function signUp(domain string, _pricePerHit uint256) returns()
func (_DomainMicropay *DomainMicropaySession) SignUp(domain string, _pricePerHit *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.Contract.SignUp(&_DomainMicropay.TransactOpts, domain, _pricePerHit)
}

// SignUp is a paid mutator transaction binding the contract method 0x69075afe.
//
// Solidity: function signUp(domain string, _pricePerHit uint256) returns()
func (_DomainMicropay *DomainMicropayTransactorSession) SignUp(domain string, _pricePerHit *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.Contract.SignUp(&_DomainMicropay.TransactOpts, domain, _pricePerHit)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(amount uint256) returns()
func (_DomainMicropay *DomainMicropayTransactor) Withdraw(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.contract.Transact(opts, "withdraw", amount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(amount uint256) returns()
func (_DomainMicropay *DomainMicropaySession) Withdraw(amount *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.Contract.Withdraw(&_DomainMicropay.TransactOpts, amount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(amount uint256) returns()
func (_DomainMicropay *DomainMicropayTransactorSession) Withdraw(amount *big.Int) (*types.Transaction, error) {
	return _DomainMicropay.Contract.Withdraw(&_DomainMicropay.TransactOpts, amount)
}
