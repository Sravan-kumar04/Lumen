import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const addSupplier = async (supplier) => {
    try {
      await axios.post('/api/suppliers', supplier);
      fetchSuppliers();
    } catch (err) {
      console.error('Error adding supplier:', err);
    }
  };

  const updateSupplier = async (id, updatedSupplier) => {
    try {
      await axios.put(`/api/suppliers/${id}`, updatedSupplier);
      fetchSuppliers();
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error('Error deleting supplier:', err);
    }
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};