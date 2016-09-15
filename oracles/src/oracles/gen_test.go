package oracles

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/crypto"
)

func TestMigrations(t *testing.T) {
	key, _ := crypto.GenerateKey()
	auth := bind.NewKeyedTransactor(key)
	sim := backends.NewSimulatedBackend(core.GenesisAccount{Address: auth.From, Balance: big.NewInt(1000000000)})

	addr, xa, mig, err := DeployMigrations(auth, sim)
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("Contract pending deploy: 0x%x\nTransaction waiting to be mined: 0x%x\nMigration: (%T)%#v", addr, xa, mig, mig)

	sim.Commit()
}

func TestConvertLib(t *testing.T) {
	key, _ := crypto.GenerateKey()
	auth := bind.NewKeyedTransactor(key)
	sim := backends.NewSimulatedBackend(core.GenesisAccount{Address: auth.From, Balance: big.NewInt(1000000000)})

	addr, xa, cl, err := DeployConvertLib(auth, sim)
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("Contract pending deploy: 0x%x\nTransaction waiting to be mined: 0x%x\nConvertLib: (%T)%#v", addr, xa, cl, cl)

	sim.Commit()
}

func TestUserClientMicropay(t *testing.T) {
	key, _ := crypto.GenerateKey()
	auth := bind.NewKeyedTransactor(key)
	sim := backends.NewSimulatedBackend(core.GenesisAccount{Address: auth.From, Balance: big.NewInt(1000000000)})

	addr, xa, uc, err := DeployUserClientMicropay(auth, sim, auth.From, auth.From, auth.From, big.NewInt(33))
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("Contract pending deploy: 0x%x\nTransaction waiting to be mined: 0x%x\nClientMicropay: (%T)%#v", addr, xa, uc, uc)

	p, err := uc.PricePerHit(&bind.CallOpts{Pending: true})
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("PricePerHit before: %v", p)

	sim.Commit()

	p, err = uc.PricePerHit(&bind.CallOpts{Pending: true})
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("PricePerHit after: %v", p)
}

func TestDomainMicropay(t *testing.T) {
	key, _ := crypto.GenerateKey()
	auth := bind.NewKeyedTransactor(key)
	sim := backends.NewSimulatedBackend(core.GenesisAccount{Address: auth.From, Balance: big.NewInt(1000000000)})

	addr, xa, dc, err := DeployDomainMicropay(auth, sim)
	if err != nil {
		t.Fatal(err)
	}
	t.Logf("Contract pending deploy: 0x%x\nTransaction waiting to be mined: 0x%x\nDomainMicropay: (%T)%#v", addr, xa, dc, dc)

	sim.Commit()
}
