'use strict';

// Importer le module Fabric SDK
const { Contract } = require('fabric-contract-api');

// Définir le contrat intelligent SupplyChainContract
class SupplyChainContract extends Contract {

    // Méthode d'initialisation du contrat
    async initLedger(ctx) {
        console.info('Initialisation du ledger avec des produits par défaut');
        const produits = [
            {
                id: '1',
                nom: 'Produit 1',
                proprietaire: 'Fabricant',
                etat: 'En stock'
            },
            {
                id: '2',
                nom: 'Produit 2',
                proprietaire: 'Fournisseur',
                etat: 'En transit'
            }
        ];

        // Ajouter les produits au ledger
        for (let i = 0; i < produits.length; i++) {
            await ctx.stub.putState(produits[i].id, Buffer.from(JSON.stringify(produits[i])));
            console.info('Produit ajouté au ledger : ', produits[i]);
        }
        console.info('Initialisation du ledger terminée');
    }

    // Méthode pour enregistrer un nouveau produit dans la chaîne d'approvisionnement
    async enregistrerProduit(ctx, id, nom, proprietaire, etat) {
        console.info('Enregistrement d\'un nouveau produit');
        const produit = {
            id,
            nom,
            proprietaire,
            etat
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(produit)));
        console.info('Produit enregistré dans le ledger : ', produit);
        return JSON.stringify(produit);
    }

    // Méthode pour récupérer les détails d'un produit en fonction de son ID
    async recupererProduit(ctx, id) {
        const produitJSON = await ctx.stub.getState(id);
        if (!produitJSON || produitJSON.length === 0) {
            throw new Error(`Le produit avec l'ID ${id} n'a pas été trouvé`);
        }
        console.info('Produit récupéré du ledger : ', produitJSON.toString());
        return produitJSON.toString();
    }
}

module.exports = SupplyChainContract;