import React, { useMemo, useState } from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CheckCircle2Icon,
  MapPinIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface BarangayNode {
  name: string;
  type: 'region' | 'province' | 'municipality' | 'barangay';
  children?: BarangayNode[];
}
const LOCATION_DATA: BarangayNode[] = [
{
  name: 'Region III - Central Luzon',
  type: 'region',
  children: [
  {
    name: 'Bulacan',
    type: 'province',
    children: [
    {
      name: 'Malolos',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Atlag',
        type: 'barangay'
      },
      {
        name: 'Barangay Catmon',
        type: 'barangay'
      },
      {
        name: 'Barangay Caliligawan',
        type: 'barangay'
      },
      {
        name: 'Barangay Ligas',
        type: 'barangay'
      }]

    },
    {
      name: 'Meycauayan',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Bagbaguin',
        type: 'barangay'
      },
      {
        name: 'Barangay Bancal',
        type: 'barangay'
      },
      {
        name: 'Barangay Pandayan',
        type: 'barangay'
      }]

    }]

  },
  {
    name: 'Pampanga',
    type: 'province',
    children: [
    {
      name: 'San Fernando',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Dolores',
        type: 'barangay'
      },
      {
        name: 'Barangay Magliman',
        type: 'barangay'
      },
      {
        name: 'Barangay San Jose',
        type: 'barangay'
      }]

    }]

  }]

},
{
  name: 'Region IV-A - CALABARZON',
  type: 'region',
  children: [
  {
    name: 'Laguna',
    type: 'province',
    children: [
    {
      name: 'Calamba',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Real',
        type: 'barangay'
      },
      {
        name: 'Barangay Parian',
        type: 'barangay'
      },
      {
        name: 'Barangay Bucal',
        type: 'barangay'
      },
      {
        name: 'Barangay Halang',
        type: 'barangay'
      }]

    },
    {
      name: 'Los Baños',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Anos',
        type: 'barangay'
      },
      {
        name: 'Barangay Batong Malake',
        type: 'barangay'
      },
      {
        name: 'Barangay Bayog',
        type: 'barangay'
      }]

    }]

  },
  {
    name: 'Cavite',
    type: 'province',
    children: [
    {
      name: 'Bacoor',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Habay',
        type: 'barangay'
      },
      {
        name: 'Barangay Molino',
        type: 'barangay'
      },
      {
        name: 'Barangay Talaba',
        type: 'barangay'
      }]

    },
    {
      name: 'Dasmariñas',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Paliparan',
        type: 'barangay'
      },
      {
        name: 'Barangay Salawag',
        type: 'barangay'
      },
      {
        name: 'Barangay San Agustin',
        type: 'barangay'
      }]

    }]

  }]

},
{
  name: 'Region V - Bicol',
  type: 'region',
  children: [
  {
    name: 'Albay',
    type: 'province',
    children: [
    {
      name: 'Legazpi',
      type: 'municipality',
      children: [
      {
        name: 'Barangay Cabagñan',
        type: 'barangay'
      },
      {
        name: 'Barangay Bonot',
        type: 'barangay'
      }]

    }]

  }]

}];

interface SelectedLocation {
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}
interface LocationTreeProps {
  searchQuery: string;
  selected: SelectedLocation | null;
  onSelect: (loc: SelectedLocation) => void;
}
function matchesSearch(node: BarangayNode, query: string): boolean {
  const q = query.toLowerCase();
  if (node.name.toLowerCase().includes(q)) return true;
  if (node.children) return node.children.some((c) => matchesSearch(c, q));
  return false;
}
interface TreeNodeProps {
  node: BarangayNode;
  depth: number;
  path: string[];
  searchQuery: string;
  selected: SelectedLocation | null;
  onSelect: (loc: SelectedLocation) => void;
}
function TreeNode({
  node,
  depth,
  path,
  searchQuery,
  selected,
  onSelect
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const isBarangay = node.type === 'barangay';
  const currentPath = [...path, node.name];
  const isVisible = !searchQuery || matchesSearch(node, searchQuery);
  const shouldAutoExpand =
  searchQuery && !isBarangay && matchesSearch(node, searchQuery);
  const isExpanded = expanded || shouldAutoExpand;
  const isSelected =
  isBarangay &&
  selected?.barangay === node.name &&
  selected?.municipality === path[path.length - 1];
  if (!isVisible) return null;
  const depthColors: Record<number, string> = {
    0: 'text-secondary-700 font-semibold',
    1: 'text-gray-700 font-medium',
    2: 'text-gray-600',
    3: 'text-gray-700'
  };
  const typeIcons: Record<string, string> = {
    region: '🏛',
    province: '📍',
    municipality: '🏘'
  };
  return (
    <div>
      <button
        onClick={() => {
          if (isBarangay) {
            onSelect({
              region: currentPath[0],
              province: currentPath[1],
              municipality: currentPath[2],
              barangay: node.name
            });
          } else {
            setExpanded(!isExpanded);
          }
        }}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left group ${isSelected ? 'bg-primary/10 text-primary font-medium' : isBarangay ? 'hover:bg-secondary-50 text-gray-700' : 'hover:bg-gray-50'}`}
        style={{
          paddingLeft: `${depth * 20 + 12}px`
        }}>
        
        {!isBarangay ?
        <span className="text-gray-400 transition-transform">
            {isExpanded ?
          <ChevronDownIcon size={16} /> :

          <ChevronRightIcon size={16} />
          }
          </span> :

        <span className="w-4 flex justify-center">
            {isSelected ?
          <CheckCircle2Icon size={16} className="text-primary" /> :

          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 group-hover:border-secondary transition-colors" />
          }
          </span>
        }

        {!isBarangay && <span className="text-xs">{typeIcons[node.type]}</span>}
        {isBarangay &&
        <MapPinIcon
          size={14}
          className={isSelected ? 'text-primary' : 'text-gray-400'} />

        }

        <span className={depthColors[depth] || 'text-gray-600'}>
          {node.name}
        </span>

        {!isBarangay && node.children &&
        <span className="ml-auto text-xs text-gray-400 font-normal">
            {node.children.length}
          </span>
        }
      </button>

      <AnimatePresence>
        {isExpanded && node.children &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="overflow-hidden">
          
            {node.children.map((child) =>
          <TreeNode
            key={child.name}
            node={child}
            depth={depth + 1}
            path={currentPath}
            searchQuery={searchQuery}
            selected={selected}
            onSelect={onSelect} />

          )}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
export function LocationTree({
  searchQuery,
  selected,
  onSelect
}: LocationTreeProps) {
  return (
    <div className="space-y-0.5">
      {LOCATION_DATA.map((region) =>
      <TreeNode
        key={region.name}
        node={region}
        depth={0}
        path={[]}
        searchQuery={searchQuery}
        selected={selected}
        onSelect={onSelect} />

      )}
    </div>);

}