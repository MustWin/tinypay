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
