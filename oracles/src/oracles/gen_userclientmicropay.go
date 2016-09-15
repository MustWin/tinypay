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

// UserClientMicropayABI is the input ABI used to generate the binding from.
const UserClientMicropayABI = `[{"constant":true,"inputs":[],"name":"pricePerHit","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"registerHit","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_domainMicropayContract","type":"address"},{"name":"_micropay","type":"address"},{"name":"_client","type":"address"},{"name":"_pricePerHit","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"DispatchAmount","type":"event"}]`

// UserClientMicropayBin is the compiled bytecode used for deploying new contracts.
const UserClientMicropayBin = `60606040526040516080806101f3833960e06040529051905160a05160c05160008054600160a060020a031990811684179091556001805482168517905560038290556002805490911685179055505050506101948061005f6000396000f3606060405260e060020a600035046303e00f4381146100345780632e1a7d4d14610042578063fff89feb1461008b575b610002565b34610002576100a260035481565b34610002576100b4600435600154600090819033600160a060020a039081169116148015906100815750600054600160a060020a039081163390911614155b156100bb57610002565b34610002576100b460035434101561016357610002565b60408051918252519081900360200190f35b005b505050565b60646063840204915060648304905030600160a060020a03163181830111156100e357610002565b670de0b6b3a76400008310156100f857610002565b600254604051600160a060020a03919091169082156108fc029083906000818181858888f19350505050151561012d57610002565b60008054604051600160a060020a03919091169184156108fc02918591818181858888f1935050505015156100b657610002565b565b600354604051600160a060020a0330169180156108fc02916000818181858888f1935050505015156101615761000256`

// DeployUserClientMicropay deploys a new Ethereum contract, binding an instance of UserClientMicropay to it.
func DeployUserClientMicropay(auth *bind.TransactOpts, backend bind.ContractBackend, _domainMicropayContract common.Address, _micropay common.Address, _client common.Address, _pricePerHit *big.Int) (common.Address, *types.Transaction, *UserClientMicropay, error) {
	parsed, err := abi.JSON(strings.NewReader(UserClientMicropayABI))
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	address, tx, contract, err := bind.DeployContract(auth, parsed, common.FromHex(UserClientMicropayBin), backend, _domainMicropayContract, _micropay, _client, _pricePerHit)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &UserClientMicropay{UserClientMicropayCaller: UserClientMicropayCaller{contract: contract}, UserClientMicropayTransactor: UserClientMicropayTransactor{contract: contract}}, nil
}

// UserClientMicropay is an auto generated Go binding around an Ethereum contract.
type UserClientMicropay struct {
	UserClientMicropayCaller     // Read-only binding to the contract
	UserClientMicropayTransactor // Write-only binding to the contract
}

// UserClientMicropayCaller is an auto generated read-only Go binding around an Ethereum contract.
type UserClientMicropayCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// UserClientMicropayTransactor is an auto generated write-only Go binding around an Ethereum contract.
type UserClientMicropayTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// UserClientMicropaySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type UserClientMicropaySession struct {
	Contract     *UserClientMicropay // Generic contract binding to set the session for
	CallOpts     bind.CallOpts       // Call options to use throughout this session
	TransactOpts bind.TransactOpts   // Transaction auth options to use throughout this session
}

// UserClientMicropayCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type UserClientMicropayCallerSession struct {
	Contract *UserClientMicropayCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts             // Call options to use throughout this session
}

// UserClientMicropayTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type UserClientMicropayTransactorSession struct {
	Contract     *UserClientMicropayTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts             // Transaction auth options to use throughout this session
}

// UserClientMicropayRaw is an auto generated low-level Go binding around an Ethereum contract.
type UserClientMicropayRaw struct {
	Contract *UserClientMicropay // Generic contract binding to access the raw methods on
}

// UserClientMicropayCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type UserClientMicropayCallerRaw struct {
	Contract *UserClientMicropayCaller // Generic read-only contract binding to access the raw methods on
}

// UserClientMicropayTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type UserClientMicropayTransactorRaw struct {
	Contract *UserClientMicropayTransactor // Generic write-only contract binding to access the raw methods on
}

// NewUserClientMicropay creates a new instance of UserClientMicropay, bound to a specific deployed contract.
func NewUserClientMicropay(address common.Address, backend bind.ContractBackend) (*UserClientMicropay, error) {
	contract, err := bindUserClientMicropay(address, backend.(bind.ContractCaller), backend.(bind.ContractTransactor))
	if err != nil {
		return nil, err
	}
	return &UserClientMicropay{UserClientMicropayCaller: UserClientMicropayCaller{contract: contract}, UserClientMicropayTransactor: UserClientMicropayTransactor{contract: contract}}, nil
}

// NewUserClientMicropayCaller creates a new read-only instance of UserClientMicropay, bound to a specific deployed contract.
func NewUserClientMicropayCaller(address common.Address, caller bind.ContractCaller) (*UserClientMicropayCaller, error) {
	contract, err := bindUserClientMicropay(address, caller, nil)
	if err != nil {
		return nil, err
	}
	return &UserClientMicropayCaller{contract: contract}, nil
}

// NewUserClientMicropayTransactor creates a new write-only instance of UserClientMicropay, bound to a specific deployed contract.
func NewUserClientMicropayTransactor(address common.Address, transactor bind.ContractTransactor) (*UserClientMicropayTransactor, error) {
	contract, err := bindUserClientMicropay(address, nil, transactor)
	if err != nil {
		return nil, err
	}
	return &UserClientMicropayTransactor{contract: contract}, nil
}

// bindUserClientMicropay binds a generic wrapper to an already deployed contract.
func bindUserClientMicropay(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(UserClientMicropayABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_UserClientMicropay *UserClientMicropayRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _UserClientMicropay.Contract.UserClientMicropayCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_UserClientMicropay *UserClientMicropayRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _UserClientMicropay.Contract.UserClientMicropayTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_UserClientMicropay *UserClientMicropayRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _UserClientMicropay.Contract.UserClientMicropayTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_UserClientMicropay *UserClientMicropayCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _UserClientMicropay.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_UserClientMicropay *UserClientMicropayTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _UserClientMicropay.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_UserClientMicropay *UserClientMicropayTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _UserClientMicropay.Contract.contract.Transact(opts, method, params...)
}

// PricePerHit is a free data retrieval call binding the contract method 0x03e00f43.
//
// Solidity: function pricePerHit() constant returns(uint256)
func (_UserClientMicropay *UserClientMicropayCaller) PricePerHit(opts *bind.CallOpts) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _UserClientMicropay.contract.Call(opts, out, "pricePerHit")
	return *ret0, err
}

// PricePerHit is a free data retrieval call binding the contract method 0x03e00f43.
//
// Solidity: function pricePerHit() constant returns(uint256)
func (_UserClientMicropay *UserClientMicropaySession) PricePerHit() (*big.Int, error) {
	return _UserClientMicropay.Contract.PricePerHit(&_UserClientMicropay.CallOpts)
}

// PricePerHit is a free data retrieval call binding the contract method 0x03e00f43.
//
// Solidity: function pricePerHit() constant returns(uint256)
func (_UserClientMicropay *UserClientMicropayCallerSession) PricePerHit() (*big.Int, error) {
	return _UserClientMicropay.Contract.PricePerHit(&_UserClientMicropay.CallOpts)
}

// RegisterHit is a paid mutator transaction binding the contract method 0xfff89feb.
//
// Solidity: function registerHit() returns()
func (_UserClientMicropay *UserClientMicropayTransactor) RegisterHit(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _UserClientMicropay.contract.Transact(opts, "registerHit")
}

// RegisterHit is a paid mutator transaction binding the contract method 0xfff89feb.
//
// Solidity: function registerHit() returns()
func (_UserClientMicropay *UserClientMicropaySession) RegisterHit() (*types.Transaction, error) {
	return _UserClientMicropay.Contract.RegisterHit(&_UserClientMicropay.TransactOpts)
}

// RegisterHit is a paid mutator transaction binding the contract method 0xfff89feb.
//
// Solidity: function registerHit() returns()
func (_UserClientMicropay *UserClientMicropayTransactorSession) RegisterHit() (*types.Transaction, error) {
	return _UserClientMicropay.Contract.RegisterHit(&_UserClientMicropay.TransactOpts)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(amount uint256) returns()
func (_UserClientMicropay *UserClientMicropayTransactor) Withdraw(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _UserClientMicropay.contract.Transact(opts, "withdraw", amount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(amount uint256) returns()
func (_UserClientMicropay *UserClientMicropaySession) Withdraw(amount *big.Int) (*types.Transaction, error) {
	return _UserClientMicropay.Contract.Withdraw(&_UserClientMicropay.TransactOpts, amount)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2e1a7d4d.
//
// Solidity: function withdraw(amount uint256) returns()
func (_UserClientMicropay *UserClientMicropayTransactorSession) Withdraw(amount *big.Int) (*types.Transaction, error) {
	return _UserClientMicropay.Contract.Withdraw(&_UserClientMicropay.TransactOpts, amount)
}
