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

// ConvertLibABI is the input ABI used to generate the binding from.
const ConvertLibABI = `[{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"conversionRate","type":"uint256"}],"name":"convert","outputs":[{"name":"convertedAmount","type":"uint256"}],"payable":false,"type":"function"}]`

// ConvertLibBin is the compiled bytecode used for deploying new contracts.
const ConvertLibBin = `606060405260398060106000396000f3650402149dba9b50606060405260e060020a600035046396e4ee3d81146024575b6007565b34600757602435600435026060908152602090f3`

// DeployConvertLib deploys a new Ethereum contract, binding an instance of ConvertLib to it.
func DeployConvertLib(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *ConvertLib, error) {
	parsed, err := abi.JSON(strings.NewReader(ConvertLibABI))
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	address, tx, contract, err := bind.DeployContract(auth, parsed, common.FromHex(ConvertLibBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &ConvertLib{ConvertLibCaller: ConvertLibCaller{contract: contract}, ConvertLibTransactor: ConvertLibTransactor{contract: contract}}, nil
}

// ConvertLib is an auto generated Go binding around an Ethereum contract.
type ConvertLib struct {
	ConvertLibCaller     // Read-only binding to the contract
	ConvertLibTransactor // Write-only binding to the contract
}

// ConvertLibCaller is an auto generated read-only Go binding around an Ethereum contract.
type ConvertLibCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ConvertLibTransactor is an auto generated write-only Go binding around an Ethereum contract.
type ConvertLibTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// ConvertLibSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type ConvertLibSession struct {
	Contract     *ConvertLib       // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// ConvertLibCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type ConvertLibCallerSession struct {
	Contract *ConvertLibCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts     // Call options to use throughout this session
}

// ConvertLibTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type ConvertLibTransactorSession struct {
	Contract     *ConvertLibTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts     // Transaction auth options to use throughout this session
}

// ConvertLibRaw is an auto generated low-level Go binding around an Ethereum contract.
type ConvertLibRaw struct {
	Contract *ConvertLib // Generic contract binding to access the raw methods on
}

// ConvertLibCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type ConvertLibCallerRaw struct {
	Contract *ConvertLibCaller // Generic read-only contract binding to access the raw methods on
}

// ConvertLibTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type ConvertLibTransactorRaw struct {
	Contract *ConvertLibTransactor // Generic write-only contract binding to access the raw methods on
}

// NewConvertLib creates a new instance of ConvertLib, bound to a specific deployed contract.
func NewConvertLib(address common.Address, backend bind.ContractBackend) (*ConvertLib, error) {
	contract, err := bindConvertLib(address, backend.(bind.ContractCaller), backend.(bind.ContractTransactor))
	if err != nil {
		return nil, err
	}
	return &ConvertLib{ConvertLibCaller: ConvertLibCaller{contract: contract}, ConvertLibTransactor: ConvertLibTransactor{contract: contract}}, nil
}

// NewConvertLibCaller creates a new read-only instance of ConvertLib, bound to a specific deployed contract.
func NewConvertLibCaller(address common.Address, caller bind.ContractCaller) (*ConvertLibCaller, error) {
	contract, err := bindConvertLib(address, caller, nil)
	if err != nil {
		return nil, err
	}
	return &ConvertLibCaller{contract: contract}, nil
}

// NewConvertLibTransactor creates a new write-only instance of ConvertLib, bound to a specific deployed contract.
func NewConvertLibTransactor(address common.Address, transactor bind.ContractTransactor) (*ConvertLibTransactor, error) {
	contract, err := bindConvertLib(address, nil, transactor)
	if err != nil {
		return nil, err
	}
	return &ConvertLibTransactor{contract: contract}, nil
}

// bindConvertLib binds a generic wrapper to an already deployed contract.
func bindConvertLib(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(ConvertLibABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ConvertLib *ConvertLibRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _ConvertLib.Contract.ConvertLibCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ConvertLib *ConvertLibRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ConvertLib.Contract.ConvertLibTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ConvertLib *ConvertLibRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ConvertLib.Contract.ConvertLibTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_ConvertLib *ConvertLibCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _ConvertLib.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_ConvertLib *ConvertLibTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _ConvertLib.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_ConvertLib *ConvertLibTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _ConvertLib.Contract.contract.Transact(opts, method, params...)
}

// Convert is a paid mutator transaction binding the contract method 0x96e4ee3d.
//
// Solidity: function convert(amount uint256, conversionRate uint256) returns(convertedAmount uint256)
func (_ConvertLib *ConvertLibTransactor) Convert(opts *bind.TransactOpts, amount *big.Int, conversionRate *big.Int) (*types.Transaction, error) {
	return _ConvertLib.contract.Transact(opts, "convert", amount, conversionRate)
}

// Convert is a paid mutator transaction binding the contract method 0x96e4ee3d.
//
// Solidity: function convert(amount uint256, conversionRate uint256) returns(convertedAmount uint256)
func (_ConvertLib *ConvertLibSession) Convert(amount *big.Int, conversionRate *big.Int) (*types.Transaction, error) {
	return _ConvertLib.Contract.Convert(&_ConvertLib.TransactOpts, amount, conversionRate)
}

// Convert is a paid mutator transaction binding the contract method 0x96e4ee3d.
//
// Solidity: function convert(amount uint256, conversionRate uint256) returns(convertedAmount uint256)
func (_ConvertLib *ConvertLibTransactorSession) Convert(amount *big.Int, conversionRate *big.Int) (*types.Transaction, error) {
	return _ConvertLib.Contract.Convert(&_ConvertLib.TransactOpts, amount, conversionRate)
}
